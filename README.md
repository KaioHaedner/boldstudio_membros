# BoldStudioHub

Cópia organizada de `KaioHaedner/boldstudio_membros`, commit `6e06f19`.
Destino: `boldstudiobrasil/BoldStudioHub`.

## Código por área

| Domínio | Diretório | Conteúdo |
| --- | --- | --- |
| `boldstudiobrasil.com`, `www` | `src/apps/site/` | Institucional, serviços, cases, checkout, componentes e dados |
| `academy.boldstudiobrasil.com` | `src/apps/academy/` | Páginas, layout e hooks de alunos; tema do login |
| `admin.boldstudiobrasil.com` | `src/apps/admin/` | Painel administrativo e tema do login |
| `crew.boldstudiobrasil.com` | `src/apps/crew/` | Tema de login existente; painel `/crew` ainda não implementado |
| `api.boldstudiobrasil.com` | `api/` | Proxy de mídias no runtime Vercel |
| Compartilhado | `src/shared/` | Auth, páginas legais, componentes, estilos e integrações |
| Banco e funções | `supabase/` | Migrations e Edge Functions; publicação separada do frontend |
| Assets locais | `public/` | Arquivos versionados; não contém todo o Storage |

O frontend continua sendo **uma SPA React/Vite**, com fontes separadas por área
e um build compartilhado. A separação não cria deploys independentes nem muda
permissões. `src/App.tsx` reúne as rotas e `src/shared/lib/area.ts` detecta o host.

## Desenvolvimento

1. Execute `npm ci`.
2. Crie `.env.local` a partir de `.env.example` e configure a chave pública
   Supabase. Nunca coloque service_role/secret em variáveis `VITE_*`.
3. Execute `npm run dev`.
4. Teste os temas em `/login?area=academy`, `/login?area=admin` e `/login?area=crew`.
5. Execute `npm run build` para gerar `dist/` e `npm run lint` para revisar o código.

## Publicação e mídias

Vercel: framework Vite, diretório raiz, comando `npm run build`, saída `dist`.
`vercel.json` mantém o fallback das rotas. `/api/media` depende do runtime Vercel;
não existe no servidor Vite nem em uma hospedagem estática por simples upload.

`VITE_MEDIA_BASE_URL` define um host de mídia separado. Vazio usa `/api/media`
do próprio deployment, permitindo previews sem depender do host antigo da API.

Supabase principal indicado: `heriogfvynncvabbwspu`. Os buckets legados continuam
em `erhtqgaxibncpondscna` até que seus objetos sejam copiados. Trocar a URL não
migra dados, usuários ou mídias. Origem bloqueada por quota continua falhando.

Para um institucional sem banco, ainda é necessário migrar as mídias,
substituir formulários e separar a inicialização da autenticação. A área de
alunos continua dependendo de banco e autenticação.

Consulte [deployment/README.md](deployment/README.md) e
[docs/MIGRATION-2026-10-05.md](docs/MIGRATION-2026-10-05.md).
