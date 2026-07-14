# SAVE-199 | 14/07/2026 | BoldStudio: teaser lateral compacto da RecIA

## Ajuste

- Balão branco acima do ícone substituído por pill lateral alinhada à esquerda da RecIA.
- Fundo grafite translúcido, borda amarela discreta, texto branco e seta apontando para o ícone.
- Altura fixada em 48px para as frases não alterarem o layout durante a rotação.
- Largura máxima reduzida para 11.5rem e fonte para 12px.
- Ícone da RecIA reduzido de 64px para 56px no mobile, preservando 64px a partir do breakpoint `sm`.
- Animação passou de movimento vertical para entrada e saída lateral.
- `prefers-reduced-motion` desativa a animação.
- Textos encurtados em português, inglês e espanhol.

## Textos em português

- `Fale com a Bold`
- `Seu próximo vídeo começa aqui`
- `Vamos gravar algo bold?`

## Validação

- Lint focado: passou.
- `npm run typecheck`: passou.
- `npm run build`: passou.
- `git diff --check`: passou.

## Arquivos

- `src/components/home/RecIAWidget.tsx`
- `src/i18n/translations.ts`
- `src/index.css`

## Relacionados

[[project_boldstudio]] [[SAVE-198_2026-07-14_boldstudio-header-pills-isoladas]]
