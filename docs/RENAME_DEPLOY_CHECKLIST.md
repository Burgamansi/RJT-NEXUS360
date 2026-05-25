# RJT NEXUS360 Rename And Deploy Checklist

## Vercel

- [ ] Renomear projeto na Vercel para `rjt-nexus360`.
- [ ] Revisar domínio final da plataforma.
- [ ] Revisar `TURSO_DATABASE_URL`.
- [ ] Revisar `TURSO_AUTH_TOKEN`.
- [ ] Revisar variáveis de IA, se existirem, como `GEMINI_API_KEY`.
- [ ] Confirmar build com `npm run build`.
- [ ] Confirmar lint/typecheck com `npm run lint`.
- [ ] Confirmar se uploads continuam funcionando.
- [ ] Confirmar se dados do cliente União Bag continuam filtrados por `company_id`.

## GitHub

- [ ] Confirmar repositório GitHub `Burgamansi/RJT-NEXUS360`.
- [ ] Depois atualizar remote local:

```bash
git remote set-url origin https://github.com/Burgamansi/rjt-nexus360.git
```

## Pasta Local

- [ ] Fechar VS Code.
- [ ] Confirmar pasta local do projeto RJT NEXUS360.
- [ ] Abrir novamente a pasta no VS Code.
- [ ] Rodar `npm install` se necessário.
- [ ] Rodar `npm run lint`.
- [ ] Rodar `npm run build`.

## Segurança

- [ ] Não expor tokens em logs, prints ou commits.
- [ ] Não commitar `.env`.
- [ ] Manter `.env.example` apenas com placeholders.
- [ ] Confirmar que Turso/LibSQL segue como banco via `TURSO_DATABASE_URL` e `TURSO_AUTH_TOKEN`.
- [ ] Não migrar para Supabase nesta etapa.
