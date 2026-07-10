# SAVE-186 — 10/07/2026 — BoldStudio: footer em todas as páginas, fotos Crew p&b/coloridas, fix bug pin do Crew, RecIA sólido

## Resumo da sessão

Sessão de ajustes na **landing page principal** (home institucional) e no restante do site do BoldStudio. Quatro frentes: (1) footer rico em **todas as páginas**, (2) fotos do **Crew** em preto&branco (padrão) + coloridas (hover/clique) coladas na borda do card, (3) correção do **bug dos cards do Crew** que exigia refresh manual na primeira carga, (4) fundo do chat do **RecIA** 100% sólido.

**Repo:** `KaioHaedner/boldstudio_membros` · **Local:** `C:\Users\cleom\boldstudio-platform` · **Deploy:** Vercel (push na `main` = deploy automático) · **Domínio:** boldstudiobrasil.com
**Stack:** Vite v8 + React 19 + TS + Tailwind v4 + Supabase + Three.js + GSAP
**Commits:** `0727252` (footer todas páginas + fotos crew p&b/coloridas flush) → `cbd0c2c` (footer rico + fix pin Crew + RecIA sólido + tipografia footer)

## O que foi feito

### 1. Footer em TODAS as páginas
- `src/components/Footer.tsx` **reescrito** com o visual do footer da home (logo + tagline, **SiteMap**, **Páginas Essenciais**, redes Instagram/Facebook/WhatsApp/E-mail, "Powered by Kaio H & BoldStudio"), porém **autossuficiente**: NÃO usa `useI18n` (texto PT estático) e os links funcionam de qualquer página.
  - SiteMap → `/home-bold-studio-sinop-brasil#{ancora}` via `<a href>` (scroll nativo no load); legais → `/termos`, `/privacidade`, `/cookies`, `/uso-da-ia`.
- Aplicado (usando esse componente) em: **AuthShell** (login/cadastro/2fa/recuperar/redefinir de uma vez), LandingPage, ProjetoClientePage (conteúdo + notFound), CheckoutPage, SucessoPage, NotFoundPage, **AdminLayout** (com `pb-20 md:pb-0` pra não colar na bottom nav), **ComingSoon**. Já tinham: HomeInstitucional (home/Footer i18n), LegalPages, AppLayout.
- **ComingSoon**: era `position:fixed;inset:0` (cobria tudo). Convertido pra `position:relative;min-height:100vh` e `.waves`/`.powered` de `fixed`→`absolute`, pro rodapé aparecer rolando abaixo do "Em Breve" sem quebrar o visual.
- **Tipografia (pedido do cliente):** títulos amarelos (SiteMap / Páginas Essenciais) **2x maiores** → `text-[1.75rem]` (vs `text-sm`=0.875rem dos itens); itens brancos abaixo com **peso menor** → `font-light`. Aplicado nos DOIS footers (`components/Footer.tsx` e `components/home/Footer.tsx`).
- **Por que reescrever em vez de reusar o da home:** `components/home/Footer.tsx` depende do `I18nProvider` (trilíngue PT/EN/ES). Páginas fora da home (login, admin, checkout, 404, Em Breve) não têm o provider → usá-lo direto quebraria. Home segue com o footer i18n; as demais com o autossuficiente (visual idêntico).

### 2. Fotos do Crew — p&b (padrão) + coloridas (hover/clique)
- Buckets Supabase (projeto `erhtqgaxibncpondscna`):
  - P&B: `FOTOS_CREW_PR_BR/`
  - Coloridas: `Fotos_CREW_COLORIDAS/`
- `CrewSticky.tsx`: cada membro com foto tem **duas camadas empilhadas** (`<img>` absolute inset:0): p&b embaixo (padrão, estática) + colorida por cima com `opacity:0` → `1` no `:hover` e quando trava (classe `is-color`), **transição 0.5s**. Clique no botão faz toggle (`colorLocked` = `Set<string>` no estado).
- **Mapeamento nome→arquivo:** Pedrão=`pedro-garcia` (PEDRAO), juninho/"Pedro junior"=`pedro-neto` (juninho), cavedon=`bruno` (CAVEDON_PR_BR / CAVEDON_BOLD_IMG_CREW), Carol/MULHER_MIGUEL=`caroline`, + miguel (MIGUEL_..._v2_PR / MIGUEL), rafa (RAFAELA), germano (GERMANO), willian (IMG_1088.JPG 2_PR / IMG_1088.JPG 1). **Nathalia Umburanas SEM foto** (segue com ícone `User` placeholder — cliente não mandou as URLs dela).
- **Imagem colada na borda (pedido):** removido `padding:2.5rem` e `gap:2rem` do `.crew-card` (agora 0) + `overflow:hidden`; `.crew-card__info` ganhou o `padding:2.5rem`; `.crew-card__photo` virou `align-self:stretch` (altura total), sem borda amarela nem radius próprios → foto flush no topo/direita/baixo, cantos direitos clipados pelo radius do card. Mobile idem (`padding` sai do card, vai pro info).

### 3. Fix do bug dos cards do Crew (exigia refresh manual)
- **Causa raiz:** o `ScrollTrigger` com `pin` mede a posição da seção Crew (`start:'top top'`) no `useEffect` de mount. Mas na **primeira visita da sessão** a `IntroBold` toca e o conteúdo entra com `home-oculto` (`opacity:0`) → `home-revelar` (slide-up `translateY` de 900ms). O pin é medido ANTES do reveal e das seções acima (ReelsEspiral/Three.js, ClientesWave/vídeos, fontes) carregarem → medidas erradas, cards bugam. No refresh, `sessionStorage.bold_intro_exibida` já existe → conteúdo aparece direto → medidas corretas. **Por isso o refresh "consertava".**
- **Fix:**
  - `HomeInstitucionalPage.tsx`: novo `useEffect([revelar])` → `ScrollTrigger.refresh()` 1000ms após `revelar=true` (fim do slide-up).
  - `CrewSticky.tsx`: `ScrollTrigger.refresh()` no `requestAnimationFrame`, no `window 'load'` e no `document.fonts.ready`; `end` virou **função** (`() => '+=' + ...`) + `invalidateOnRefresh:true` pra recomputar no refresh.

### 4. RecIA — fundo do chat 100% sólido
- Painel usava a classe `.liquid-glass` (fundo translúcido `rgba(...0.74/0.62)` + `backdrop-filter blur`). Como `liquid-glass` é usado **também no ContactForm**, NÃO mexi nela globalmente.
- Adicionada classe `.recia-solid` (em `index.css`, depois de liquid-glass pra sobrescrever): `background:linear-gradient(135deg,#1c1c1c,#0a0a0a)` opaco + `backdrop-filter:none`. Aplicada só no painel do RecIA (`liquid-glass recia-solid ...`). ContactForm mantém o efeito de vidro.

## Gotchas / decisões
- **Validação de URL no Windows:** `curl` no sandbox Bash retorna HTTP `000` (rede bloqueada). Usar **PowerShell `Invoke-WebRequest -Method Head`** — as 16 URLs das fotos retornaram 200.
- **Extensão do Chrome desconectada** nesta sessão → sem verificação visual automatizada (mcp claude-in-chrome falhou "Browser extension is not connected"). Validado por `typecheck` + `build` + `lint`.
- **Lint:** 22 erros **pré-existentes** em arquivos não tocados (`AdminReciaFormsPage` set-state-in-effect, `webhook-ticto` unused var, etc.). Nenhum nos arquivos alterados.
- TS narrowing: `const hasPhoto = 'bw' in m` narrowa `m` no ternário (TS 4.4+ aliased conditions) — por isso `m.bw`/`m.color` compilam mesmo com a variante sem foto (nathalia).

## Arquivos alterados
`src/components/Footer.tsx` (reescrito), `src/components/home/Footer.tsx`, `src/components/home/CrewSticky.tsx`, `src/components/home/RecIAWidget.tsx`, `src/components/AuthShell.tsx`, `src/components/AdminLayout.tsx`, `src/pages/HomeInstitucionalPage.tsx`, `src/pages/LandingPage.tsx`, `src/pages/ComingSoon.tsx`, `src/pages/CheckoutPage.tsx`, `src/pages/SucessoPage.tsx`, `src/pages/NotFoundPage.tsx`, `src/pages/ProjetoClientePage.tsx`, `src/index.css`.

## Pendências (próximas sessões)
- **Foto da Nathalia Umburanas** (p&b + colorida) — cliente ainda não enviou.
- **Conferir no deploy** (não deu pra validar visualmente): o **bug do Crew** em cenários específicos (1ª visita vs troca de idioma vs mobile), o flush da foto no card, e o RecIA sólido.
- Continua pendente de saves antigos: fotos de eventos dos clientes, traduzir segmentos (area) pro EN/ES, player no espiral, code-split do Three.js (~1.3MB).

## Relacionado
- [[Projeto BoldStudio]] · [[reference_boldstudio_infra]] · [[SAVE-185_2026-07-09_cellopoeta]] · [[SAVE-167_2026-06-19_boldstudio-i18n-paginas-cliente]]
