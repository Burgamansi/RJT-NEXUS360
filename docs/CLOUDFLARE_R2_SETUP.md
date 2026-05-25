# Cloudflare R2 Setup — RJT NEXUS360

> Documento de arquitetura e configuração do armazenamento de objetos para o SaaS RJT NEXUS360.
> **NÃO commitar valores reais de tokens/secrets neste arquivo.**

---

## 1. Visão Geral da Arquitetura

```
┌─────────────────────────────────────────────────────┐
│                  RJT NEXUS360 SaaS                   │
├──────────────┬──────────────────┬────────────────────┤
│   FRONTEND   │     BACKEND      │     STORAGE        │
│   React/Vite │  Express (Node)  │                    │
│   Vercel CDN │  Vercel Function │  Turso (LibSQL)    │
│              │  /api/index.ts   │  └─ dados relacionais│
│              │                  │  └─ usuários        │
│              │                  │  └─ planos          │
│              │                  │  └─ auditoria       │
│              │                  │                    │
│              │                  │  Cloudflare R2     │
│              │                  │  └─ uploads        │
│              │                  │  └─ relatórios     │
│              │                  │  └─ evidências     │
│              │                  │  └─ backups CSV    │
└──────────────┴──────────────────┴────────────────────┘
```

---

## 2. O que vai no Banco (Turso/LibSQL)

| Dados | Motivo |
|---|---|
| Usuários, senhas (hash) | Relacional, queries frequentes |
| Empresas/tenants | Joins com uploads e relatórios |
| Planos e limites | Leitura rápida por empresa |
| Logs de auditoria | Histórico estruturado |
| Metadados de arquivos | URLs, tamanhos, datas de upload |
| KPIs calculados | Cache de métricas por empresa |

---

## 3. O que vai no R2 (Cloudflare Object Storage)

| Arquivos | Pasta no bucket |
|---|---|
| Uploads de planilhas Excel/CSV | `clientes/<empresa-id>/uploads/` |
| Relatórios PDF gerados | `clientes/<empresa-id>/relatorios/` |
| Evidências e documentos SGI | `clientes/<empresa-id>/evidencias/` |
| Backups de dados brutos | `backups/<ano>/<mes>/` |
| Assets temporários de processamento | `temp/` |

---

## 4. Bucket Criado

| Campo | Valor |
|---|---|
| **Nome do bucket** | `rjt-nexus360-files` |
| **Região** | Auto (Cloudflare global edge) |
| **Acesso público** | Desabilitado (privado) |
| **Integração com app** | Pendente (futuro) |

---

## 5. Variáveis de Ambiente Necessárias

Adicionar ao Vercel (Settings → Environment Variables) e ao `.env` local **sem expor valores reais**:

```env
# Cloudflare R2 — Object Storage
# Encontrar em: dash.cloudflare.com → R2 → Manage R2 API Tokens

R2_ACCOUNT_ID=your_cloudflare_account_id_here
R2_ACCESS_KEY_ID=your_r2_access_key_id_here
R2_SECRET_ACCESS_KEY=your_r2_secret_access_key_here
R2_BUCKET_NAME=rjt-nexus360-files
R2_PUBLIC_URL=https://pub-XXXXXXXXXXXX.r2.dev
# ou domínio customizado: https://storage.rjtnexus360.com.br
```

### Onde encontrar cada variável:

| Variável | Onde encontrar |
|---|---|
| `R2_ACCOUNT_ID` | dash.cloudflare.com → lado direito da sidebar → Account ID |
| `R2_ACCESS_KEY_ID` | R2 → Manage R2 API Tokens → Create API Token |
| `R2_SECRET_ACCESS_KEY` | Mesmo fluxo acima (aparece apenas 1x) |
| `R2_BUCKET_NAME` | `rjt-nexus360-files` (fixo) |
| `R2_PUBLIC_URL` | R2 → bucket → Settings → Public access |

---

## 6. Estratégia Futura de Upload (Multi-Tenant)

### Fluxo recomendado:

```
1. Frontend → POST /api/upload (com arquivo + empresa_id)
       ↓
2. Backend valida plano da empresa (limite de storage no Turso)
       ↓
3. Backend gera URL pré-assinada no R2 (S3-compatible API)
       ↓
4. Frontend faz upload direto para R2 (sem passar pelo servidor)
       ↓
5. Backend salva metadados no Turso (nome, tamanho, path no R2, empresa_id)
       ↓
6. Frontend confirma upload e atualiza dashboard
```

### Dependência npm a instalar quando integrar:

```bash
npm install @aws-sdk/client-s3 @aws-sdk/s3-request-presigner
```

### Exemplo de configuração do cliente R2 (S3-compatible):

```typescript
// src/config/r2.ts — NÃO incluir em produção sem variáveis de ambiente
import { S3Client } from "@aws-sdk/client-s3";

export const r2Client = new S3Client({
  region: "auto",
  endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
  },
});

export const R2_BUCKET = process.env.R2_BUCKET_NAME ?? "rjt-nexus360-files";
```

---

## 7. Estrutura de Pastas Sugerida no Bucket

```
rjt-nexus360-files/
├── clientes/
│   └── <empresa-id>/           # ex: uniao-bag, cliente-abc
│       ├── uploads/
│       │   ├── financeiro/
│       │   ├── rh/
│       │   └── operacoes/
│       ├── relatorios/
│       │   ├── 2025/
│       │   └── 2026/
│       └── evidencias/
│           ├── iso-9001/
│           ├── iso-14001/
│           └── iso-45001/
├── backups/
│   └── <ano>/
│       └── <mes>/
└── temp/                       # limpar periodicamente
```

---

## 8. Segurança e Boas Práticas

- ✅ Bucket privado — nunca habilitar acesso público sem domínio customizado
- ✅ API Token com permissões mínimas: apenas `Object Read & Write` para o bucket específico
- ✅ URLs pré-assinadas com expiração curta (15 minutos para upload, 1 hora para download)
- ✅ Validar tipo e tamanho de arquivo no backend antes de gerar URL pré-assinada
- ✅ Separar pastas por `empresa_id` — garantia de isolamento multi-tenant
- ✅ Nunca expor `R2_SECRET_ACCESS_KEY` no frontend
- ⏳ Futuramente: limites de storage por plano (Free / Pro / Enterprise)

---

## 9. Status Atual

| Item | Status |
|---|---|
| Bucket `rjt-nexus360-files` criado | ⏳ Pendente criação manual |
| Variáveis adicionadas ao Vercel | ⏳ Aguardando tokens R2 |
| Integração `@aws-sdk/client-s3` | ⏳ Fase futura |
| Upload direto do frontend | ⏳ Fase futura |
| URLs pré-assinadas | ⏳ Fase futura |
| Domínio customizado no bucket | ⏳ Fase futura |

---

*Criado em: 2026-05-24 — RJT NEXUS360 v1.0*
*Arquitetura: Vercel (frontend + functions) + Turso (banco) + Cloudflare R2 (storage)*
