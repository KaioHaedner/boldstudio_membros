# Story: Crew full-screen e clientes em duas pistas

**Status:** Ready for Review

## Origem

Requisitos fornecidos diretamente pelo usuário em 2026-07-14, usando o screenshot da Sand Filmes somente como referência de escala editorial.

## Objetivo

Atualizar duas cenas da home institucional sem descaracterizar a BoldStudio.

## Critérios de aceitação

- [x] Manter a tipografia atual do projeto.
- [x] Manter a paleta BoldStudio existente.
- [x] Manter conteúdo, fotos, interação e empilhamento dos cards atuais do Crew.
- [x] Fazer os cards do Crew ocuparem quase toda a viewport.
- [x] Substituir a coluna ondulada de clientes por duas pistas horizontais.
- [x] Posicionar uma pista acima e outra abaixo, com movimentos em sentidos opostos.
- [x] Manter logos clicáveis, modal e links para projetos.
- [x] Manter parallax e ScrollTrigger existentes.
- [x] Respeitar `prefers-reduced-motion`.
- [x] Validar lint, typecheck e build; registrar ausência de testes se aplicável.

## Checklist técnico

- [x] Implementação desktop
- [x] Implementação mobile
- [x] Acessibilidade das cópias visuais
- [x] Revisão de performance
- [x] Quality gates executados

## Validação

- Lint focado em `ClientesWave.tsx`: aprovado.
- Typecheck: aprovado.
- Build de produção: aprovado.
- Lint global: bloqueado por 22 erros e 2 avisos preexistentes fora do escopo.
- Testes: indisponíveis porque o projeto não possui script `test`.
- Revisão visual no navegador real: pendente de conferência do usuário.

## File List

- `docs/stories/2026-07-14-home-crew-clientes-editorial.md`
- `src/components/home/ClientesWave.tsx`
- `src/index.css`
- `task_plan.md`
- `findings.md`
- `progress.md`
- `docs/saves/SAVE-196_2026-07-14_boldstudio-crew-fullscreen-clientes-duas-pistas.md`
