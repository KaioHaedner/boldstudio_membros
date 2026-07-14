# SAVE-201 | 14/07/2026 | BoldStudio: faixa-manifesto do Crew

## Ajuste

- Adicionada uma faixa amarela horizontal de largura total antes dos cards do Crew.
- Texto preto, pesado e em caixa alta: `O ÚLTIMO TIME AUDIOVISUAL QUE VOCÊ TERÁ`.
- Frase repetida em dois grupos idênticos para formar loop contínuo sem emenda.
- Movimento automático da direita para a esquerda em 24 segundos.
- Separador editorial `✦` entre as repetições.
- Versões equivalentes adicionadas em inglês e espanhol.
- `prefers-reduced-motion` mantém a faixa estática.
- Cards e ScrollTrigger do Crew foram preservados.

## Validação

- Lint focado: passou.
- `npm run typecheck`: passou.
- `npm run build`: passou.
- `git diff --check`: passou.

## Arquivos

- `src/components/home/CrewSticky.tsx`
- `src/i18n/translations.ts`
- `src/index.css`
- `docs/stories/2026-07-14-home-crew-clientes-editorial.md`

## Relacionados

[[project_boldstudio]] [[SAVE-200_2026-07-14_boldstudio-hero-mobile-centralizada]]
