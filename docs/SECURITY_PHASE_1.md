# Relatório de Mitigação de Segurança — SECURITY PHASE 1

Este documento descreve as correções de segurança aplicadas no projeto **RJT NEXUS360** durante a **Fase 1 de Segurança (Security Phase 1)**. O objetivo foi mitigar os riscos mais críticos de forma cirúrgica e segura, preparando o ecossistema para a futura implementação de um provedor de autenticação robusto.

---

## 1. O que foi corrigido

### 1.1 Bloqueio de Desenvolvimento em Produção
*   **Locais:** `src/config/mockSession.ts` e `src/components/dev/RoleSwitcher.tsx`
*   **Mitigação:** 
    *   Criou-se a verificação híbrida `isProdEnv()` que detecta se a aplicação está rodando em produção (tanto do lado do Vite com `import.meta.env.PROD` quanto do lado do Express/NodeJS com `process.env.NODE_ENV === "production"`).
    *   Se for produção, a leitura de privilégios (`AppRole`) a partir da chave do `localStorage` é **terminantemente bloqueada**, evitando escalação lateral de privilégios via console do desenvolvedor.
    *   Forçou-se a role padrão em produção para `"visualizador"` (perfil somente leitura/restrito), impedindo que usuários anônimos operem com `"tenant_admin"`.
    *   O componente `RoleSwitcher` visual não é renderizado em produção.

### 1.2 Criação do Guard Utilitário de Tenant (Multi-Tenant Isolation)
*   **Local:** `src/server/security/tenantGuard.ts`
*   **Mitigação:** 
    *   Criou-se um módulo de segurança centralizado para normalização de IDs de empresas (`companyId`).
    *   A função `normalizeCompanyId()` higieniza a entrada removendo espaços e validando-a contra expressões regulares para rejeitar injeções de SQL.
    *   A função `requireCompanyId()` atua no backend validando e garantindo a presença do ID do tenant nas requisições, lançando erros HTTP `400` específicos caso esteja ausente ou corrompido.

### 1.3 Blindagem de Endpoints contra Vazamentos Cross-Tenant
*   **Local:** `src/controllers/api.controller.ts`
*   **Mitigação:**
    *   **Histórico de Uploads (`getUploads`):** O endpoint `/api/uploads` agora exige obrigatoriamente a presença de `companyId` na query string. Se ausente, retorna HTTP `400`. Se presente, a consulta é escopada estritamente para o tenant fornecido.
    *   **Gráficos e Indicadores (`getMetrics`):** O endpoint `/api/metrics` agora exige de forma rígida o `companyId` na query string. Caso contrário, retorna HTTP `400`.
    *   **Resumos Executivos e Insights (`getReport`):** O endpoint `/api/report/:domain` agora obriga o envio do `companyId` na query, escopando as métricas obtidas do repositório para evitar que insights de uma empresa vazem para os painéis de terceiros.
    *   **Tratamento de decodificação segura:** Implementou-se um fallback de decodificação no `getReport` para evitar quebras visuais se o campo `value` ou `metadata` não estiver formatado em JSON.

### 1.4 Proteção de Segurança no Repositório de Dados
*   **Local:** `src/repositories/index.ts`
*   **Mitigação:**
    *   Os métodos do repositório `getNormalizedByUpload` e `getRawByUpload` foram adaptados para aceitar um parâmetro opcional `companyId`.
    *   Se fornecido, a query SQL filtra obrigatoriamente por `company_id = ?`, impedindo ataques onde IDs de uploads sequenciais de outras empresas sejam adivinhados.

### 1.5 Remoção do Bypass Administrativo em Produção
*   **Local:** `src/routes/admin.routes.ts`
*   **Mitigação:**
    *   O middleware `isAdminMaster` foi blindado. Em ambiente de produção, cabeçalhos de desenvolvimento (`x-user-role`) e queries com bypass (`companyId === "demo_company"`) são **completamente rejeitados**, retornando HTTP `403 Forbidden`.
    *   Em ambiente local de desenvolvimento (DEV), o bypass continua ativo para facilitar a produtividade e os testes do desenvolvedor.

### 1.6 Phase 1.1 Repository Tenant Enforcement (Imposição de Tenant Rígida no Banco)
*   **Local:** `src/repositories/index.ts` e `src/services/file.service.ts`
*   **Mitigação:**
    *   **Remoção de Opcionalidade:** O parâmetro `companyId` deixou de ser opcional e passou a ser **estritamente obrigatório** em todos os métodos do repositório que leem, atualizam ou criam uploads, dados brutos, dados normalizados, relatórios ou métricas.
    *   **Cláusulas WHERE Obrigatórias:** Reestruturou-se as queries SQL para que nenhuma operação sensível de leitura de dados de tenant (como `getNormalizedByUpload`, `getRawByUpload` e `getMetrics`) rode sem um `company_id = ?` fixo e obrigatório.
    *   **Lançamento de Erro Controlado:** Caso um método seja invocado com `companyId` ausente ou nulo, o repositório **lança imediatamente uma exceção** de segurança em tempo de execução, impedindo qualquer acesso acidental a dados globais.
    *   **Proteção Cruzada de Serviço:** O `fileService.processUpload` agora exige o `companyId` do controller, recupera o registro de upload aplicando o filtro de tenant no banco e executa validação dupla em memória comparando `upload.company_id === companyId`.
    *   **Limitação Transitória em deleteMetricsByUpload:** Como a tabela `metrics` não possui nativamente uma coluna `upload_id` (a referência do upload é guardada internamente no JSON da coluna `metadata`), o repositório mantém o uso de `metadata LIKE '%"uploadId":"ID"%'` escopado com `company_id = ?` como uma limitação transitória de exclusão de métricas.

---

## 2. O que ainda é placeholder (Em aberto)

*   **Validação Criptográfica de Tokens:** Embora o backend exija `companyId` nos endpoints chaves, ele ainda não valida a assinatura criptográfica de um token de sessão. Confia-se no `companyId` vindo do frontend que agora é higienizado.
*   **Controle de Acesso Fino:** Os middlewares `requireAuth` e `requireRole` no Express ainda chamam `next()` sem verificar se a credencial confere com a role requisitada.
*   **Modelagem de Banco (Limitação Transitória):** A tabela `metrics` carece da coluna `upload_id` indexada para otimização de exclusões. Atualmente, usa-se a varredura parcial de string via `LIKE` em `metadata`.
*   **Criptografia de Dados:** Os payloads estruturados no SQLite local (Turso) são gravados em formato de JSON simples em texto plano.

---

## 3. Riscos Restantes

*   **Falsificação de Parâmetros (Bypass Parcial):** Sem validação de JWT, um usuário comum do frontend que domine requisições HTTP pode chamar a API `/api/uploads?companyId=OUTRA_EMPRESA` e tentar obter dados de outra empresa (embora as requisições normais no frontend usem sempre o ID fixado do usuário).
*   **Risco de Endpoints Não Mapeados:** Se novos endpoints de API forem construídos futuramente sem a injeção do `tenantGuard` e da assinatura de `companyId`, o vazamento cross-tenant poderá retornar.

---

## 4. Próximos Passos Recomendados

Para atingir um nível de segurança corporativa de grau de produção (SaaS Enterprise), a próxima fase deve focar na **Autenticação Real**:

1.  **Fiação Completa do Frontend:** Atualizar as chamadas do frontend para obter o token JWT no endpoint de login e enviá-lo nos cabeçalhos `Authorization: Bearer <token>` nas requisições subsequentes.
2.  **Criação do Endpoint de Login/Auth Real:** Desenvolver o controller e a rota de login real no backend Express que verifique a hash de senha do usuário no banco SQLite (Turso) e assine um JWT real com claims válidas usando `signToken()`.

---

## 5. Phase 2 Preparation (Preparação Arquitetural de Segurança)

Para antecipar a autenticação real e pavimentar o caminho de segurança multi-tenant, realizou-se a fiação estrutural completa do JWT e do Request no backend:

### 5.1 Tipagem Central e Injeção do Request Context
*   **Locais:** `src/types/auth.ts`
*   **Implementação:** 
    *   Definiu-se a tipagem segura de autenticação contendo `AuthUser` e `JwtPayload` (claims do token: `userId`, `companyId`, `role`, `email`, `exp`).
    *   Estendeu-se globalmente o namespace `Express.Request` adicionando de forma segura a propriedade tipada `req.auth` para injetar o contexto autenticado nas rotas e controllers do Express.

### 5.2 Utilitário de JWT Nativo em HS256 (Sem dependências externas)
*   **Local:** `src/server/security/jwt.ts`
*   **Implementação:**
    *   Criou-se codificadores e decodificadores seguros do padrão **JWT (RFC 7519)** usando o algoritmo HMAC SHA-256 alimentado exclusivamente pela API criptográfica nativa do NodeJS (`node:crypto`).
    *   Exporta as funções `signToken` (geração de assinaturas) e `verifyToken` (validação de integridade e expiração de tempo).

### 5.3 Middlewares Reais e Robustos do Express
*   **Local:** `src/config/auth.ts`
*   **Implementação:**
    *   **`attachAuthContext`**: Extrai o token do cabeçalho `Authorization: Bearer <token>`, decodifica via `verifyToken()` e popula `req.auth` com as claims reais do tenant. Se ausente, em ambiente de desenvolvimento (DEV), atacha o mock controlado. Injetado de forma global em `src/app.ts`.
    *   **`requireAuth`**: Verifica a presença de `req.auth.user`. Se ausente, barra o tráfego retornando HTTP `401`.
    *   **`requireTenant`**: Garante o escopo ativo do tenant (`req.auth.companyId`).
    *   **`requireRole` e `requirePermission`**: Validam e autorizam o privilégio do papel requisitado no backend real, respondendo com HTTP `403`.

### 5.4 Segurança Rígida de Multi-Tenant em Produção (Descontinuação de req.body.companyId)
*   **Local:** `src/server/security/tenantGuard.ts` e `src/controllers/api.controller.ts`
*   **Implementação:**
    *   O guard `getTenantIdFromRequest(req)` foi reescrito. Em produção, ele **exige** que o `companyId` seja extraído **estritamente de `req.auth.companyId`** (o contexto autenticado e validado criptograficamente), proibindo leituras de parâmetros planos do corpo ou da query string.
    *   Todos os controllers sensíveis de métricas, uploads e relatórios foram adaptados para obter o tenant proprietário via `getTenantIdFromRequest(req)`.

