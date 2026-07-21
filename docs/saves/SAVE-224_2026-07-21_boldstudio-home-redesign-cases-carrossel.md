# SAVE-224 — 2026-07-21 — BoldStudio home redesign (hero → cases)

Redesign pesado da home institucional (`/home-bold-studio-sinop-brasil`), seção por seção, seguindo referências da produtora **Sand**. Repo `KaioHaedner/boldstudio_membros`, branch `main`.

## Commits publicados (deploy Vercel automático via GitHub)
- `2a7a668` feat(home): reformula hero + status de localizacao no header
- `27cc8ed` feat(home): secao Sobre estilo Sand + coin da marca espalhado
- `623f2f5` feat(home): secao Solucoes (placeholder + pill sticky) e amarelo vivo animado
- **PENDENTE de commit/deploy:** todo o bloco de **Cases** (abertura + carrossel blur reveal + marquee de marcas + remoção da espiral). Estava aprovado, faltou o "deploy" final (usuário pediu "save daily" antes).

## Hero (`HomeInstitucionalPage.tsx`)
- Título realocado pro **topo direito**, 3 linhas: `ENTREGAMOS / RESULTADOS (amarelo) / NÃO VÍDEOS!` (translations `hero.titleA/titleHighlight/titleB` + `<br>` entre os spans). Tamanho reduzido pra não tampar o vídeo BG.
- CTAs colados na **base esquerda** (`absolute bottom-7 left-5 z-[90]`): principal = `ShinyButton` (borda de luz), secundário = editorial uppercase + seta amarela.
- Subtítulo com painel de vidro (`bg-black/45 backdrop-blur`).
- **Removido `<BottomBlur/>`** da home (escurecia a base/CTAs; usuário achou feio).

## Raiz do domínio (`App.tsx` `RootGate`)
- `boldstudiobrasil.com` agora **redireciona direto** pra `/home-bold-studio-sinop-brasil` (era a página "Em Breve"). Removido import `ComingSoon`.

## Header — status geo + relógio (`HeaderStatus.tsx`, novo)
- Pill central entre logo e menu: **cidade · estado · país via IP** (`fetch https://ipwho.is/`) + **relógio ao vivo** no fuso do visitante (`Intl.DateTimeFormat`, atualiza a cada 15s). Só desktop (`lg:flex`).
- Texto em **amarelo Bold** com borda amarela. Sem CSP no projeto → a chamada geo funciona em prod.

## Sobre — estilo Sand (`SobreAboutUs.tsx`, novo)
- Foto do crew (`BOLDSTUDIO_CREW_ABOUTUS.webp`) sobre **mancha branca irregular tipo respingo/Nickelodeon** (SVG `SplatBlob` com gota puxada + respingos), em **parallax**.
- Texto em 3 parágrafos **bold, sem bullets, palavras-chave em amarelo** (marcação `**...**` → span amarelo via `renderHighlighted`). Copy nova estilo Sand (`sobre.paragraphs`).
- **Reveal por scroll que repete**: cada parágrafo `gsap.set(autoAlpha:0)` + `ScrollTrigger onEnter/onLeave/onEnterBack/onLeaveBack` (surge ao entrar, some ao sair). **Gotcha resolvido:** `self.selector` do `gsap.context` não retornava os elementos → usar `section.querySelectorAll` direto.

## Soluções (`SolucoesSticky.tsx`, novo — substituiu os cards de serviços)
- Área de produtos = **placeholder** (imagens ainda não existem), altura `70vh`.
- Etiqueta amarela **"Soluções" sticky** no estilo do BoldCrew (pill `rounded-r-2xl`).
- `servicos.label` novo nas 3 línguas.

## Amarelo vivo animado (`.live-yellow` no `index.css`)
- **Gotcha-chave:** gradiente animado por `background-position` **NÃO repinta** dentro de seções que o GSAP promove a camada de composição (ex: crew pinado) — fica estático. Solução: gradiente **deslizando via `transform: translateX` num `::before`** (compositável na GPU, anima em qualquer contexto). O gradiente tem 2 ciclos idênticos em 200% de largura + translate -50% = loop perfeito.
- Aplicado no pill **Soluções** e no **BoldCrew** (`crew-signature` ganhou classe `live-yellow`).
- **Gotcha:** `.live-yellow { position: relative }` sobrescreve `absolute` do Tailwind → quando precisar posicionar, **envolver num `<div absolute>`** e deixar o pill com live-yellow dentro.

## Coin da marca espalhado (`CoinDecor.tsx`, novo)
- Símbolo `BOLDSTUDIO_COIN.webp` como elemento decorativo flutuante (`@keyframes coin-bob`, float sutil). Espalhado na hero, Sobre, Serviços, Clientes e Contato (opacidades/rotações/tamanhos variados).

## CASES (bloco novo, PENDENTE de deploy)
Ordem: `CasesAbertura` → `CasesCarrossel` → `ClientesWave` (marquee). **Removida a `ReelsEspiral`** (espiral do demoreel) do fluxo.

### Abertura (`CasesAbertura.tsx`)
- Manifesto: *"Eles confiaram na **bold**. e suas marcas estão **eternizadas**"* (logo inline `/brand/logo-boldstudio.webp`, "eternizadas" amarelo itálico).
- **Typewriter** (`useTypewriter`) rotaciona `cases.typeWords` (Live/Brand Experience, Agro, Indústria...).
- Seta amarela `ChevronDown` animate-bounce + pill **"Cases"** live-yellow no canto inferior esquerdo.
- Bloco `cases` novo nas 3 línguas (label/lineA/lineB/highlight/typeWords).

### Carrossel Blur Reveal (`CasesCarrossel.tsx`) — efeito da "Império WEB Codes Store"
- Só as **7 marcas COM vídeo**: Forteza, Machado Supermercados, Madô Burguer, John Deere·Agro Baggio, Exponorte, Grupo Sinop, Paiol Agrícola.
- Seção **pinada** (`h-screen`), cada case = slide fullscreen (vídeo do Supabase). Troca por scroll com **clip-path (inset 100%→0) + escala + blur** progressivo; título surge desfocado→nítido.
- Cada slide: número + `ShinyButton` "Ver projeto completo" (`navigate('/projeto-${slug}')`) + **logo da empresa (card branco) ao lado do nome** (nome reduzido).

### Marquee de marcas (`ClientesWave.tsx`, reescrito)
- Substituiu o wave-com-pin por **carrossel contínuo (marquee CSS)** com **TODAS as 14 marcas** (`@keyframes marcas-scroll`, translateX -50%, pausa no hover, mask de fade nas bordas). Clique abre o modal (preview vídeo 10s + depoimento + link projeto).
- **Gotcha:** `loading="lazy"` não dispara dentro do marquee com mask/animation → usar `loading="eager"` (logos pequenos).

## Assets subidos no Supabase (ref `erhtqgaxibncpondscna`, header `apikey` com `sb_secret_`)
- `Fotos_CREW_COLORIDAS/BOLDSTUDIO_CREW_ABOUTUS.webp` (foto crew About Us)
- **Bucket novo `brand`** (público) → `brand/BOLDSTUDIO_COIN.webp` (símbolo)
- Vídeos demoreel já existiam em `CLIENTES_CONTEINER_PREVIA_VD`; logos em `CLIENTES_CONTEINER` (fonte: `src/data/clientes.ts`, 14 marcas, 7 com vídeo).

## Pendências
- **Fazer o deploy** do bloco de Cases (não commitado ainda).
- **Parrilla do Campo**: logo claro/transparente some no card branco do marquee (usuário: "deixa comigo depois" — versão com contraste ou fundo diferente só nesse card).
- **Produtos da seção Soluções**: colocar imagens quando existirem (hoje é placeholder).
- Segurança git (fora deste repo): revogar colaborador Rogério Carpowiske + 1 access token — ver [[project_boldstudio_acessos_git_pendente]].

Refs: [[project_boldstudio]] [[reference_boldstudio_infra]] [[feedback_padrao_qualidade_design]]
