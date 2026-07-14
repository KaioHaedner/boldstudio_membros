# SAVE-193 | 14/07/2026 | BoldStudio: ShaderGradient oficial na home

## O que foi feito nesta sessão

- Analisado o repositório oficial `ruucm/shadergradient` e o starter para Vite + React 19.
- O preset oficial `Nighty night` foi escolhido como base por usar `waterPlane`, movimento lento, granulação e profundidade 3D.
- Instalado `@shadergradient/react@2.4.20`, versão publicada no npm e compatível com React 19.
- Instalados os peers recomendados pelo projeto: `@react-three/fiber`, `three-stdlib` e `camera-controls`.
- O shader WebGL manual anterior foi substituído por `ShaderGradientCanvas` + `ShaderGradient`.
- Paleta adaptada para a BoldStudio: `#000000`, `#212121` e `#050505`, sem as cores roxas do preset original.
- Renderer configurado com `pixelDensity={1}`, `powerPreference="low-power"`, movimento lento e fallback CSS imediato.
- A cena foi isolada em `BoldShaderGradientScene.tsx` e carregada via `React.lazy`, gerando chunk separado.
- Parallax por ponteiro e scroll continua no wrapper do fundo. GSAP, ScrollTrigger e pin do Crew não foram alterados.
- `prefers-reduced-motion` desliga a animação e o parallax.

## Validação

- Lint isolado dos dois componentes: passou.
- `npm run typecheck`: passou.
- `npm run build`: passou.
- Chunk do shader: aproximadamente 395 KB, 95 KB gzip, carregado separadamente.
- `npm audit` encontrou três avisos em ferramentas já presentes no projeto, incluindo Vite 8.0.10. Nenhum veio diretamente do ShaderGradient.
- A captura automatizada do localhost travou tanto no Chrome quanto no Edge headless. A validação visual final ficou para o deploy.

## Arquivos alterados

- `package.json`
- `package-lock.json`
- `src/components/home/StarfieldBackground.tsx`
- `src/components/home/BoldShaderGradientScene.tsx`

## Decisões e gotchas

- A versão `2.4.23` aparece no repositório, mas não estava publicada no npm em 14/07/2026. Foi usada a versão publicada `2.4.20`.
- O componente externo manteve o nome `StarfieldBackground` para preservar os consumidores atuais, embora não existam mais estrelas.
- O `LIVE-SESSION.md` segue ocupado pelo Claude Code no projeto DoceCasa e não foi sobrescrito.
- Alterações locais preexistentes em `supabase/` continuam fora deste trabalho.

## Pendências e próximo passo concreto

- Conferir visualmente o shader no deploy desktop e mobile.
- Se o contraste estiver muito escuro, ajustar somente `brightness`, `uStrength` ou `color2`, sem adicionar novas cores.
- Avaliar code splitting adicional do Three.js já usado pelo espiral, pois o bundle principal do projeto continua acima de 500 KB.

## Relacionados

[[project_boldstudio]] [[reference_boldstudio_infra]] [[SAVE-192_2026-07-14_boldstudio-fotos-coloridas-shader-gradiente]]
