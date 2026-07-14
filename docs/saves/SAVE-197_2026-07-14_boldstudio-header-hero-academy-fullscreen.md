# SAVE-197 | 14/07/2026 | BoldStudio: header editorial, hero Academy e full-screen real

## Contexto

- As capturas enviadas pelo Kaio mostram o deploy antigo, anterior ao commit local `9f25291`.
- Por isso o Crew ainda aparecia centralizado e os clientes ainda estavam na antiga coluna ondulada.
- O novo escopo foi aplicado sobre o código local mais recente.

## O que foi feito

- Header em cápsula removido.
- Logo posicionada no canto superior esquerdo em desktop e mobile.
- Desktop mostra idioma e `Menu +` no canto superior direito.
- Mobile mostra o toggle de menu no canto superior direito.
- Navegação movida para overlay editorial full-screen, com links grandes numerados, Escape e bloqueio de scroll.
- Hero passou a reutilizar `StudioVideoBg`, exatamente o mesmo componente usado no Academy.
- O asset existente não é GIF: é `VD_BOLD_01.mp4` no bucket público `avatars` do Supabase.
- Hero recebeu composição inferior, tipografia de grande escala e overlays para legibilidade.
- Cards do Crew agora medem exatamente `100vw × 100svh`, sem container central nem bordas laterais.
- Clientes continuam em duas pistas opostas, agora sem offsets verticais: duas linhas horizontais retas.
- Reduced motion continua sem pin/animação e com rolagem horizontal nativa.

## Validação

- Lint focado nos três TSX alterados: passou.
- `npm run typecheck`: passou.
- `npm run build`: passou.
- `git diff --check`: passou.
- Revisão visual automatizada não foi executada; conferir após publicação real.
- Lint global e ausência de `npm test` permanecem como registrados no SAVE-196.

## Arquivos alterados

- `src/components/home/Header.tsx`
- `src/pages/HomeInstitucionalPage.tsx`
- `src/components/home/ClientesWave.tsx`
- `src/index.css`
- `docs/stories/2026-07-14-home-crew-clientes-editorial.md`
- `task_plan.md`
- `findings.md`
- `progress.md`

## Handoff

- Criar commit scoped sem incluir os três arquivos Supabase já existentes.
- Push e deploy devem ser executados por `@devops`, conforme a Constitution.
- Sem publicação, `boldstudiobrasil.com` continuará exibindo o layout antigo visto nas capturas.

## Relacionados

[[project_boldstudio]] [[SAVE-196_2026-07-14_boldstudio-crew-fullscreen-clientes-duas-pistas]] [[reference_dupla_claude_codex]]
