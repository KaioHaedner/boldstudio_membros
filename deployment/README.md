# Ambientes da BoldStudio

## Vercel

- Repo: `boldstudiobrasil/BoldStudioHub`; framework Vite; diretório raiz;
  build `npm run build`; saída `dist`.
- Equipe confirmada: `boldstudiobrasil`, conta `bold@boldstudiobrasil.com`.
- Projeto criado: `boldstudio-hub`. Plano encontrado: Hobby; revisar plano
  apropriado para produção comercial antes de mover o domínio.
- A conexão GitHub retornou `repo_not_found`: permitir acesso do app Vercel ao
  repositório privado e conectar em Settings > Git do projeto.
- Configurar frontend e origens do proxy conforme `.env.example`.
- Variáveis `VITE_*` são públicas. Segredos das Edge Functions ficam no Supabase.
- Validar em preview antes de mover domínios.

## Domínios documentados no projeto original

| Host | Entrada | Fonte |
| --- | --- | --- |
| `boldstudiobrasil.com` / `www` | `/home-bold-studio-sinop-brasil` | `src/apps/site` |
| `academy.boldstudiobrasil.com` | `/login`, tema Academy | `src/apps/academy` |
| `admin.boldstudiobrasil.com` | `/login`, tema Admin | `src/apps/admin` |
| `crew.boldstudiobrasil.com` | `/login`, tema Crew | `src/apps/crew` |
| `api.boldstudiobrasil.com` | `/api/media?b=BUCKET&f=ARQUIVO` | `api/media.ts` |

Essa tabela não confirma o estado atual de DNS/deployments. O host API pode
servir o mesmo projeto Vercel. As fotos de `public/crew` pertencem ao portfólio.

## Hostinger

O projeto original documenta Hostinger como responsável pelo domínio/DNS e
Vercel como hospedagem. Confirmar o plano antes de mudar a arquitetura.

Para hospedar `dist/` como arquivos estáticos, configurar fallback de rotas para
`index.html`. `api/media.ts` não funciona por simples upload: hospedar as mídias
diretamente ou manter uma API compatível. Preservar os registros de e-mail.

## Supabase e Resend

- Principal indicado: `heriogfvynncvabbwspu`. Verificar schema, usuários, RLS,
  buckets e redirects Auth antes da produção.
- `supabase/` já existe; não executar `supabase init` novamente.
- `supabase link` identifica o destino; não copia dados nem arquivos.
- Não aplicar migrations antes de comparar o schema remoto com o versionado.
- Resend é chamado pelas Edge Functions. Configurar seus segredos no Supabase.
- Configurar os hosts finais nos redirects Auth e no hCaptcha.
- Segredos, senhas de banco e JWT secrets ficam no gerenciador do serviço.
