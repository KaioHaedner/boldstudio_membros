# Firebase BoldStudioHub — 05/10/2026

## Estado confirmado

- OAuth: `bold@boldstudiobrasil.com`; projeto `boldstudiohub`, número `1053417007423`.
- App Web: `BoldStudioHub Web`, ID `1:1053417007423:web:2ce82e33a0ee061bb10b8a`.
- Firestore `(default)`: Standard, Native, `southamerica-east1` (São Paulo),
  `freeTier: true`, proteção contra exclusão ativa. Regras e índices publicados.
- Authentication: Google e e-mail/senha habilitados, deploy confirmado.
- Plano Spark confirmado pelo print. Storage indisponível até Blaze;
  regras Storage **somente locais e validadas**, não publicadas.
- Nome do bucket no SDK (`boldstudiohub.firebasestorage.app`) não comprova provisionamento.
- Nenhuma contratação, alteração de DNS, Vercel ou frontend em produção.

## Integração gradual

SDK modular em `src/shared/firebase`, inicialização lazy, validação do projeto
`boldstudiohub` e flag `VITE_FIREBASE_ENABLED`. Não inicializa no fluxo existente.
Sem Admin SDK ou private key no frontend. AuthContext, hooks e páginas comerciais
continuam no Supabase. Nenhum usuário, matrícula ou papel foi migrado.

Para testar: configuração pública em `.env.firebase.local` (ignorado),
`npm run dev:firebase`, abrir `http://127.0.0.1:5174/firebase-setup`.
O laboratório só existe em desenvolvimento local e é excluído do build de produção.
Google pode criar conta Firebase; e-mail/senha exige conta Firebase já existente.
Salvar perfil grava no Firestore real quando `VITE_FIREBASE_USE_EMULATORS=false`;
nenhuma gravação ocorre ao abrir a página. As contas Supabase não são reconhecidas aqui.

## Modelo e regras

- `users_private/{uid}`: dono com e-mail verificado lê/cria/atualiza; demais negados.
- Schema fechado: `uid`, `displayName` (1–100), `createdAt`, `updatedAt`.
  UID/createdAt imutáveis; timestamps do servidor; sem role/PII adicional.
- Claims admin não dão leitura geral de perfis. Exclusão negada pelo cliente.
- Storage proposto: `users/{uid}/files/{fileId}`, dono verificado, JPEG/PNG/WebP/PDF
  até 20 MiB; sobrescrita/exclusão negadas. Downloads usam autenticação, não URL com token.
- Cursos, matrículas, respostas, papéis, mídia pública, vídeos e demais caminhos bloqueados.
  Isso é uma base restritiva, não o modelo final da Academy/Crew/Admin.
- Browser `getBlob` requer CORS do bucket com origens aprovadas quando Storage for ativado.

## Validação e limites

- Typecheck, build e lint focado aprovados; sintaxe MCP Firestore/Storage sem erros.
- Chrome desktop/mobile: laboratório e telas existentes sem erros JS/overflow;
  chamadas externas bloqueadas; Pixel Meta legado observado e preservado.
- Nenhum login/perfil/objeto real criado nos testes automatizados.
- Suíte `tests/firebase-rules.test.mjs` criada, **não executada**: emuladores
  exigem Java, ausente no PATH. Compilação não prova autorização completa.
- npm audit: 14 avisos (11 high, 2 moderate, 1 low), incluindo gRPC transitivo do
  SDK e dependências legadas. Atualização compatível não corrigiu gRPC `~1.9.0`.
  Não aplicado audit fix --force nem downgrade sugerido pelo npm.

Com Java compatível, testar apenas em demo:

```powershell
npx.cmd -y firebase-tools@latest emulators:exec --project demo-boldstudiohub --only firestore,storage "npm.cmd run test:firebase-rules"
```

A suíte exige hosts locais de emuladores e não aceita banco real.

## Próximos gates

1. Autorizar Blaze e definir orçamento/alertas (não são teto de cobrança).
2. Definir localização do bucket separadamente; provisionar com regras fechadas
   e publicar Storage após validação. Publicação bloqueada pela revisão de risco
   até confirmação de bucket/faturamento; não contornar.
3. Executar testes de regras; revisar dependências, App Check, quotas/rate limits
   e inspeção binária de arquivos. MIME declarado não comprova conteúdo.
4. Recuperar dados/usuários/objetos Supabase; mapear UIDs, relações e ACLs.
5. Integrar cada área, backend/admin e vídeos; validar ponta a ponta em preview.
6. Publicar site/mudar domínios apenas com aprovação explícita.

Fontes: [preços](https://firebase.google.com/docs/firestore/enterprise/pricing),
[Storage e Blaze](https://firebase.google.com/docs/storage/faqs-storage-changes-announced-sept-2024),
[planos](https://firebase.google.com/docs/projects/billing/firebase-pricing-plans).
