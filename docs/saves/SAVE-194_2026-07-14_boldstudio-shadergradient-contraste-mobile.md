# SAVE-194 | 14/07/2026 | BoldStudio: contraste e movimento do ShaderGradient

## O que foi feito nesta sessão

- Diagnosticado pela captura real do Kaio que o ShaderGradient carregava, mas parecia preto e estático.
- O console mostrava somente o aviso de depreciação `THREE.Clock`, vindo da biblioteca, sem erro de runtime.
- Mantida a paleta entre `#000000` e `#212121`.
- `brightness` aumentado de `0.82` para `1.75`.
- Terceiro tom ajustado de `#050505` para `#111111`.
- Relevo aumentado com `uStrength` de `1.5` para `3.4` e `uDensity` de `1.5` para `1.25`.
- Movimento tornado mais perceptível com `uSpeed` de `0.16` para `0.24`.
- Câmera e rotação refinadas para revelar melhor a superfície no mobile.
- Vinheta preta reduzida de 52% para 22%, com centro transparente ampliado de 30% para 44%.
- Parallax, GSAP, ScrollTrigger e carregamento lazy foram preservados.

## Validação

- Lint isolado dos componentes: passou.
- `npm run typecheck`: passou.
- `npm run build`: passou.
- A validação visual final deve ser feita no deploy real pelo Kaio.

## Arquivos alterados

- `src/components/home/BoldShaderGradientScene.tsx`
- `src/components/home/StarfieldBackground.tsx`

## Gotchas e próximo passo

- O aviso `THREE.Clock` é da versão atual do ShaderGradient e não impede a renderização.
- Se o efeito ainda parecer discreto, o próximo ajuste deve ser apenas `brightness` ou `color3`, sem trocar a paleta da marca.
- O `LIVE-SESSION.md` não foi alterado porque continua ocupado pelo Claude Code em outro projeto.

## Relacionados

[[project_boldstudio]] [[SAVE-193_2026-07-14_boldstudio-shadergradient-oficial]]
