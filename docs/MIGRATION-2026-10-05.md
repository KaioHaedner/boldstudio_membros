# Migração BoldStudioHub — 05/10/2026

## Origem e destino

- Origem confirmada: `KaioHaedner/boldstudio_membros`, HEAD `6e06f19`.
- `boldstudiobrasil/BoldStudioHub` já existe; seu `main` em `98ebe6f` é ancestral
  do commit atual da origem.
- Branch de trabalho: `codex/organize-subdomains`; histórico preservado.
- Checkout isolado: `BoldStudio/BoldStudioHub`; fonte de produção não editada.

## Código preparado

- [x] Clonar código e histórico.
- [x] Separar fontes Site, Academy, Admin e Crew.
- [x] Separar rotas e temas de autenticação por área; conservar URLs e markup.
- [x] Centralizar componentes, Auth, estilos e integrações em `src/shared`.
- [x] Manter API e Supabase em diretórios próprios.
- [x] Aceitar publishable key, com compatibilidade anon.
- [x] Tornar o proxy de mídias configurável para preview/destino.
- [x] Documentar ambientes com placeholders, sem credenciais.
- [ ] Publicar branch na conta GitHub da Bold.

## Recuperação e publicação pendentes

- [x] Confirmar Vercel `boldstudiobrasil`, conta `bold@boldstudiobrasil.com`.
- [x] Criar `boldstudio-hub` na equipe da Bold e configurar envs públicas.
- [ ] Autorizar acesso GitHub da Vercel ao repo privado (`repo_not_found`).
- [ ] Inspecionar schema, buckets e usuários do Supabase principal.
- [ ] Obter originais das mídias ou recuperar as origens bloqueadas.
- [ ] Migrar objetos e validar reprodução das mídias.
- [ ] Conferir RLS, funções, formulários, Auth e envs no destino.
- [ ] Publicar preview, executar QA responsivo e então mover os domínios.

A cópia do GitHub não copia Storage, dados, usuários, secrets, Vercel, DNS ou
Resend. O Supabase principal já aparece no código antigo como origem de dois
buckets; não é seguro assumir que seja um projeto vazio.

O tema Crew existe, mas o destino pós-login `/crew` não tem rota implementada
no snapshot original. A migração preserva essa situação e não declara o painel pronto.

## Validação

- Build e TypeScript: aprovados.
- Paths: 42 rotas originais, 42 na cópia; nenhuma remoção ou adição.
- Temas Academy, Admin e Crew: markup original preservado por comparação.
- Lint focado nos arquivos extraídos/configuração alterada: aprovado.
- Lint global: 24 erros e 2 avisos, exatamente os mesmos da cópia-base da origem.
- Renderização local: Site e três temas de login em 1440x900 e 390x844;
  sem erros de execução JavaScript ou overflow horizontal nesses cenários.
- As requisições externas foram bloqueadas durante esse teste: ele valida
  renderização e organização, não o funcionamento de vídeos, Auth ou formulários.
- Nenhuma senha ou token privilegiado foi adicionado aos arquivos da migração.

Projeto Vercel criado: `prj_zXXLV1iB8aZivBAqHZwPQXd5zsls`; equipe
`team_WETGC3kXJqbCAbEqC3rl4FZX`. O plano encontrado é Hobby. Para produção
comercial, revisar a contratação do plano Vercel apropriado.

Build não comprova recuperação das mídias externas nem funcionamento do banco remoto.

## Base Firebase

App Web, Authentication e Firestore Standard de São Paulo configurados no
projeto `boldstudiohub`. SDK isolado e laboratório de desenvolvimento preparados.
O fluxo comercial continua no Supabase. Storage permanece pendente de Blaze;
sem transferência de mídias, usuários ou dados ainda. Consulte `FIREBASE-SETUP.md`
e `FIREBASE-RULES-AUDIT.json` para testes, restrições e próximos gates.
