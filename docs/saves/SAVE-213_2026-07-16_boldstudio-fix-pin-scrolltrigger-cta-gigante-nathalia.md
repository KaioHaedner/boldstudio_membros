# SAVE-213 | 16/07/2026 | BoldStudio: fix do pin do ScrollTrigger na primeira visita, CTA gigante do crew e foto da Nathalia

Commit `28ab4dd` na `main`. Deploy automatico do Vercel confirmado (`READY`),
`boldstudiobrasil.com` respondendo 200.

## 1. O bug de verdade da secao BoldCrew (o mais grave)

**Sintoma:** na primeira visita da sessao, as secoes pinadas da home nao
funcionavam. Cards do crew sumiam (tela preta). Ao dar F5, voltava ao normal.
Estava documentado como comentario no `CrewSticky.tsx` ("bugava ate um refresh
manual") e culpava a medicao do ScrollTrigger — causa errada.

**Causa real:** `.home-revelar` usava `animation: home-slide-up 900ms ... both`.
O `fill-mode: both` inclui `forwards`, entao o transform do keyframe final
(`translateY(0)`) ficava pendurado no `<main>` **para sempre**. Um transform
nao-nulo torna o elemento containing block dos descendentes `position: fixed` —
exatamente como o ScrollTrigger pina secoes. O pin passava a se fixar em relacao
ao `<main>` em vez da viewport e o efeito morria.

**Por que so na primeira visita:** `home-revelar` so e aplicada quando a intro
toca, e a intro roda 1x por sessao (`sessionStorage.bold_intro_exibida`). No F5
a flag ja esta setada, a intro nao roda, a classe nunca entra, nao ha transform.

**Alcance:** `<main>` e ancestral de TODAS as secoes pinadas. `CrewSticky`,
`ClientesWave` e `ReelsEspiral` estavam mortos para todo visitante de primeira
viagem — ou seja, a maioria.

**Fix:** removido o `forwards` (`animation: home-slide-up 900ms cubic-bezier(...)`,
sem fill-mode). O keyframe final e identico ao estado natural do elemento, entao
deixar a animacao soltar o `<main>` no fim nao muda nada visualmente e limpa o
transform.

**Prova:** as medidas do pin sao IDENTICAS nos dois cenarios (spacer 7785px, top
2036px, body 14989px) — nunca houve problema de medicao. Depois do fix, com a
intro tocando: `<main>` com `transform: none` e a classe ainda aplicada; pin do
crew com `position: fixed` e `top: 0`.

## 2. CTA do crew (pedido: impacto tipo sand.black)

- `.crew-cta__title`: de `clamp(1.4rem, 3.4vw, 2.4rem)` para
  `clamp(2.9rem, 7.6vw, 7.5rem)`, caixa alta, `line-height: .84`,
  `letter-spacing: -.055em`, `max-width: 14ch`, `text-wrap: balance`.
- "bold" em amarelo (`.crew-cta__highlight`), seguindo o padrao que o hero ja
  usa com "resultados".
- i18n quebrado em `ctaTextA` / `ctaTextHighlight` / `ctaTextB` nos 3 idiomas
  (pt/en/es), mesmo padrao de `hero.titleA/titleHighlight/titleB`.
- `.crew-cta__button`: o `ShinyButton` e travado em `font-size: 1rem` e sumia ao
  lado do titulo. Ganhou escala propria via `className`, sem tocar no componente
  compartilhado (usado em outras secoes).

## 3. Foto da Nathalia Umburanas

- Upload de `Downloads/BOLDCREW_NATHALIA.webp` para o bucket
  `Fotos_CREW_COLORIDAS` como `NATHALIA_BOLD_IMG_CREW.webp`.
- Ligada no `CREW` do `CrewSticky.tsx`. Os 9 membros agora tem foto; o fallback
  de icone (`crew-card__photo--empty`) virou caminho morto mas foi mantido.

## GOTCHAS descobertos (reutilizaveis)

1. **Storage do Supabase com chave nova `sb_secret_`:** rejeita
   `Authorization: Bearer` com `{"statusCode":"403","message":"Invalid Compact JWS"}`
   (tenta parsear como JWT). Funciona com o header **`apikey`**.
2. **Captura headless da home** (o que derrubou as 3 tentativas do SAVE-204):
   - `waitUntil: 'networkidle'` NUNCA assenta — o video de fundo mantem a
     conexao aberta. Usar `domcontentloaded` + timeout.
   - A intro segura a home em `home-oculto` (opacity 0) por 10s → foto preta.
     Pular com `page.addInitScript(() => sessionStorage.setItem('bold_intro_exibida','1'))`.
   - Playwright 1.61 resolve a partir de `C:\Users\cleom\node_modules` (nao e dep
     do projeto).
3. **Regra geral:** nunca deixar `animation-fill-mode: forwards/both` com
   transform no keyframe final em ancestral de secao pinada por ScrollTrigger.

## Validacao

- Typecheck: passou. Build: passou (2.68s).
- Lint: os 22 erros sao pre-existentes (`webhook-ticto`, paginas de leads).
  Nenhum nos arquivos tocados.
- Verificacao visual REAL feita (a que faltou no SAVE-204): varredura de 9
  pontos do sticky. Cards opacos, pilha visivel, sem texto vazando — o SAVE-204
  de fato restaurou o efeito corretamente.
- CSS em producao confere: `.home-revelar{animation:.9s cubic-bezier(.16,1,.3,1) home-slide-up}`
  e `.crew-cta__title{...font-size:clamp(2.9rem,7.6vw,7.5rem)...}`.

## Arquivos

- `src/index.css`
- `src/components/home/CrewSticky.tsx`
- `src/i18n/translations.ts`
- Scripts de captura (scratchpad, nao versionados): `shot.mjs`, `sweep.mjs`,
  `intro-test.mjs`, `diag.mjs`, `pins.mjs`

## Pendencias

- **Numeros reais da Bold** (anos de mercado, projetos realizados, entregas no
  prazo, aprovacoes de primeira, NPS, estados) — bloqueia a secao de dados.
  Nao inventar; os do print sao da Sand.
- **Home ainda em `/home-bold-studio-sinop-brasil`**; a raiz serve o "EM BREVE".
  Precisa virar `/` para publicar.
- **Redesign da secao Clientes (proximo bloco, aprovado):** trocar o scroll
  horizontal pelo **Tunel 3D Scroll** (`Downloads/Túnel 3D Scroll.zip`) com os
  videos previa clicaveis no lugar das imagens, popup de "ver projeto", e o
  carrossel infinito de logos **embaixo** dele, sem sombra. Ordem definida com o
  Kaio: tunel em cima, logos embaixo.
  - **O ZIP nao e plugavel como veio:** sequestra o scroll global
    (`window.addEventListener("wheel")`), roda em loop infinito por modulo e
    nunca termina — prende o visitante e nao funciona no mobile (touch nao
    dispara `wheel`). Trocar o motor por ScrollTrigger pinado com progresso
    finito, preservando `layerGap`, `radiusX/radiusY` e o calculo de overlay.
  - **Faltam videos:** 14 clientes em `src/data/clientes.ts`, so 7 com `.mp4`.
    O tunel monta aneis de 4 por camada.
- Sticky amarelo "Cases de Sucesso", container parallax com
  `REUNIAO_BOLD_PROFISSIONALISMO.webp` + vinheta, e bullets de palavras-chave.
- **Rotacionar credenciais** (pendente desde 02/06, ver [[reference_boldstudio_infra]]).

## Relacionados

[[project_boldstudio]] [[reference_boldstudio_infra]]
[[SAVE-204_2026-07-14_boldstudio-restaura-sticky-cards-original]]
