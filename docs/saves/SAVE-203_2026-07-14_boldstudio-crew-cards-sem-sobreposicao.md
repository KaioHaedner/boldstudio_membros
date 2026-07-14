# SAVE-203 | 14/07/2026 | BoldStudio: Crew sem sobreposição de cards

## Problema observado

- Após o SAVE-202, todos os nomes, cargos e descrições apareciam acumulados no lado esquerdo.
- Os cards ocupam a mesma posição absoluta e o fundo transparente tornou visíveis também os cards futuros.

## Correção

- CSS oculta todos os cards por padrão e mantém apenas o primeiro visível antes da inicialização do GSAP.
- O ScrollTrigger passou a controlar `opacity` e `visibility` através de `autoAlpha`.
- Cards anteriores e futuros ficam ocultos.
- Nos últimos 22% de cada segmento ocorre um crossfade curto entre o card atual e o seguinte.
- ShaderGradient, rail vertical, `BoldCrew`, Header, RecIA, parallax e ScrollTrigger foram preservados.

## Validação

- `npx --no-install eslint src/components/home/CrewSticky.tsx`: passou.
- `npm run typecheck`: passou.
- `npm run build`: passou.
- `git diff --check`: passou.

## Arquivos

- `src/components/home/CrewSticky.tsx`
- `src/index.css`
- `docs/stories/2026-07-14-home-crew-clientes-editorial.md`
- `task_plan.md`
- `findings.md`
- `progress.md`

## Relacionados

[[project_boldstudio]] [[SAVE-202_2026-07-14_boldstudio-crew-rail-vertical]]
