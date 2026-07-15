# SAVE-204 | 14/07/2026 | BoldStudio: restauração do Sticky Cards GSAP original

## Fonte analisada

- `C:\Users\cleom\Downloads\Sticky Cards Scroll GSAP.zip`
- Todos os arquivos textuais do pacote foram lidos, incluindo `efeito.js`, `efeito.css`, `index.html` e `README.md`.

## Diagnóstico

- O efeito original mantém todos os cards empilhados e não usa opacidade para alterná-los.
- A animação depende de `yPercent`, `scale`, `rotationX`, z-index decrescente e origem de transformação no centro inferior.
- No SAVE-202, o fundo individual do card foi alterado de preto para transparente, revelando indevidamente os textos dos cards futuros.
- No SAVE-203, `autoAlpha` ocultou a pilha e quebrou a leitura original do efeito.

## Restauração

- Removido todo uso de `autoAlpha`, `opacity` e `visibility` adicionado pelo hotfix.
- Restaurado `background: #000000` em cada `.crew-card`.
- Preservados os valores originais `cardYOffset = 5`, `cardScaleStep = 0.075`, saída `yPercent = -250` e rotação de 35 graus.
- Preservadas as imagens coloridas, traduções, CTA, rail vertical, `BoldCrew`, Header e RecIA.
- Removido integralmente o ShaderGradient da home por decisão posterior do usuário; a base visual passa a ser preta.
- Removido também das páginas de projeto, junto das dependências exclusivas `@shadergradient/react`, `@react-three/fiber`, `camera-controls` e `three-stdlib`.

## Validação

- Lint focado: passou.
- Typecheck: passou.
- Build: passou.
- `git diff --check`: passou.
- Checagem estrutural dos parâmetros do ZIP: passou.
- Captura headless: indisponível após três tentativas documentadas; a conferência final do movimento permanece visual no navegador real.
- O build final não contém chunk do ShaderGradient e reduziu o JavaScript principal em aproximadamente 221 KB antes da compressão.

## Arquivos

- `src/components/home/CrewSticky.tsx`
- `src/index.css`
- `src/pages/HomeInstitucionalPage.tsx`
- `src/pages/ProjetoClientePage.tsx`
- `src/components/home/StarfieldBackground.tsx` (removido)
- `src/components/home/BoldShaderGradientScene.tsx` (removido)
- `package.json`
- `package-lock.json`
- `docs/stories/2026-07-14-home-crew-clientes-editorial.md`
- `task_plan.md`
- `findings.md`
- `progress.md`

## Relacionados

[[project_boldstudio]] [[SAVE-202_2026-07-14_boldstudio-crew-rail-vertical]] [[SAVE-203_2026-07-14_boldstudio-crew-cards-sem-sobreposicao]]
