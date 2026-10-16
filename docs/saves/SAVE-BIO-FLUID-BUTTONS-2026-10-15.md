# Bio — teste do fundo dos counters nos botões

URL: https://bio.boldstudiobrasil.com/bio

- Os botões usam o mesmo GLSL do fundo `FluidAura` dos counters da home. O shader foi extraído para `src/shared/lib/fluid-aura-shaders.ts` e continua sendo usado pela home sem alteração de desenho.
- A Bio usa um único contexto WebGL compartilhado e copia cada composição para os fundos dos botões, sem importar Three.js para essa página.
- Desktop com mouse: movimento limitado a 24 fps, crescimento e brilho discretos no hover, mantendo as formas fluidas visíveis. A borda amarela permanece fixa.
- Layout mobile, toque ou preferência por movimento reduzido: um quadro estático do mesmo shader. O fundo não muda durante ou após tocar.
- O desenho para quando os botões saem da tela ou a aba fica oculta. Observadores, frame e recursos gráficos são liberados ao sair da página.
- Sem WebGL, um fundo SVG/CSS preserva as formas douradas e os links continuam funcionando.

Validação: build e lint dos arquivos alterados. Chrome com desktop 1366×768, mobile touch 390×844, movimento reduzido e WebGL indisponível. Conferidos pixels renderizados, animação desktop, um único contexto gráfico ativo, quatro botões estáticos durante `touchStart`/`touchEnd` e fallback. Nenhum erro JavaScript ou HTTP.

Capturas: `docs/qa/2026-10-15/bio-fluid-desktop.png`, `bio-fluid-desktop-hover.png` e `bio-fluid-mobile.png`.

A validação dos quatro modos foi repetida na URL pública após o deploy e passou. As capturas finais são da versão publicada.
