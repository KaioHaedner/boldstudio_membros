# SAVE-198 | 14/07/2026 | BoldStudio: blur isolado nas pills do header

## Ajuste

- Removido completamente o fundo e o backdrop blur do elemento `<header>` em largura total.
- Logo recebeu sua própria pill translúcida com borda, blur e sombra.
- Idioma e `Menu +` permanecem juntos em uma segunda pill independente à direita.
- No mobile, a segunda pill contém apenas o toggle do menu.
- Todo o espaço entre as duas pills fica transparente e sem blur, revelando normalmente a hero e as demais seções.
- O espaço vazio do header usa `pointer-events-none`; somente as duas pills recebem interação.
- Menu full-screen e comportamento de navegação foram preservados.

## Validação

- Lint focado em `Header.tsx`: passou.
- `npm run typecheck`: passou.
- `npm run build`: passou.
- `git diff --check`: passou.

## Arquivos

- `src/components/home/Header.tsx`
- `docs/stories/2026-07-14-home-crew-clientes-editorial.md`

## Relacionados

[[project_boldstudio]] [[SAVE-197_2026-07-14_boldstudio-header-hero-academy-fullscreen]]
