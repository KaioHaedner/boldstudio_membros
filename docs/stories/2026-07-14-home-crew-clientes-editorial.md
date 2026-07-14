# Story: Crew full-screen e clientes em duas pistas

**Status:** Ready for Review

## Origem

Requisitos fornecidos diretamente pelo usuário em 2026-07-14, usando o screenshot da Sand Filmes somente como referência de escala editorial.

## Objetivo

Atualizar as cenas principais da home institucional sem descaracterizar a BoldStudio.

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
- [x] Remover o container em cápsula do header.
- [x] Manter o header transparente entre as extremidades, com blur somente nas pills da logo e dos controles.
- [x] Desktop com logo à esquerda, idioma e `Menu +` à direita.
- [x] Mobile com logo à esquerda e toggle à direita.
- [x] Menu principal em overlay full-screen.
- [x] Reutilizar na hero o mesmo asset de fundo do Academy.
- [x] Centralizar e elevar a composição da hero no mobile, preservando o desktop.
- [x] Crew ocupar `100vw × 100svh`.
- [x] Clientes sem offsets verticais, formando duas linhas horizontais retas.

## Checklist técnico

- [x] Implementação desktop
- [x] Implementação mobile
- [x] Acessibilidade das cópias visuais
- [x] Revisão de performance
- [x] Quality gates executados

## Validação

- Lint focado em `Header.tsx`, `ClientesWave.tsx` e `HomeInstitucionalPage.tsx`: aprovado.
- Typecheck: aprovado.
- Build de produção: aprovado.
- Lint global: bloqueado por 22 erros e 2 avisos preexistentes fora do escopo.
- Testes: indisponíveis porque o projeto não possui script `test`.
- Revisão visual no navegador real: pendente de conferência do usuário.
- As capturas recebidas ainda são do deploy anterior e não representam os commits locais.
- O asset do Academy é `VD_BOLD_01.mp4`, embora tenha sido chamado de GIF no pedido.

## File List

- `docs/stories/2026-07-14-home-crew-clientes-editorial.md`
- `src/components/home/ClientesWave.tsx`
- `src/components/home/Header.tsx`
- `src/pages/HomeInstitucionalPage.tsx`
- `src/index.css`
- `task_plan.md`
- `findings.md`
- `progress.md`
- `docs/saves/SAVE-196_2026-07-14_boldstudio-crew-fullscreen-clientes-duas-pistas.md`
- `docs/saves/SAVE-197_2026-07-14_boldstudio-header-hero-academy-fullscreen.md`
- `docs/saves/SAVE-198_2026-07-14_boldstudio-header-pills-isoladas.md`
- `docs/saves/SAVE-200_2026-07-14_boldstudio-hero-mobile-centralizada.md`
