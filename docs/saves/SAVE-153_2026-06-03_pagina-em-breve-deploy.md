# SAVE-153 · 03/06/2026 · Página "Em Breve" no domínio raiz + deploy

## Contexto
O site oficial da BoldStudio ainda está em construção. Criamos uma página "Em Breve" para o domínio raiz `boldstudiobrasil.com` enquanto isso, e colocamos no ar.

## O que foi feito

### Página "Em Breve" (componente ComingSoon)
- Base: a partir de um loader de "chip de circuito" (uiverse) recolorido pro tema BOLD.
- Arquivo standalone de preview/iteração: `C:\Users\cleom\boldstudio-em-breve\index.html` (onde lapidamos o visual antes de portar pro repo).
- Componente no repo: **`src/pages/ComingSoon.tsx`** — todo o HTML/CSS embutido via `dangerouslySetInnerHTML`, escopado sob `.cs-root` (o `<style>` só existe enquanto montado, não vaza pro app).

**Elementos da página:**
- Brandbar: logo estática `/brand/logo-primary.png` (a mesma do app), ~52px. (Testamos logo motion `logo-animated.mp4` mas Kaio preferiu a estática.)
- Chip de circuito SVG com "EM BREVE" no centro, traces animados em tons de dourado/âmbar (gold/softgold/amber/warm), glow pulsante. Tamanho grande (`max-width:702px`, +50% sobre o inicial).
- Título **BoldStudio** (Anton, "Studio" em dourado, só iniciais maiúsculas).
- Copy: "Estamos construindo algo grande. Um novo site e uma plataforma de **videoaulas e conteúdo audiovisual**, em breve no ar."
- 4 botões sociais (Instagram, Facebook, WhatsApp, E-mail) com hover dourado (cor BOLD, sobem + escalam + nome embaixo).
- Fundo: aurora pulsante + grid sutil + vignette + 3 waves douradas animadas na base.
- Rodapé fixo "Powered by Kaio H & BoldStudio" com fundo degradê (sai de cima da wave).
- **100% responsivo**: breakpoints por largura (900/560/380) e por altura (860/700/580/480 paisagem).

### Roteamento (`src/App.tsx`)
- `RootGate`: quando `getArea() === 'public'` (domínio raiz), agora faz `<Navigate to="/home" replace />` em vez de renderizar `LandingPage`.
- Nova rota `/home` → `<ComingSoon />`.
- `LandingPage` preservada em `/landing` (pra reverter fácil quando o site lançar — é só voltar o RootGate pra `<LandingPage />`).
- Subdomínios `academy.`/`admin.`/`crew.` **inalterados** (continuam → `/login`). `area.ts` não foi tocado.

### Deploy
- Build local OK (`npm run build`, tsc + vite, ~11s, sem erros).
- Commit `eacd4d5` na main (só `ComingSoon.tsx` + `App.tsx`).
- `git push origin main` → Vercel **auto-deploy READY em produção** (13:24).
- Confirmado via API Vercel (projeto `prj_UNyg5DWUTH2xqm9xUXmZBHE1OBlr`, team `team_qpnyrWNIBkE2HGGCHZcU90Xl`).
- **No ar:** boldstudiobrasil.com → redireciona /home → Em Breve. boldstudiobrasil.com/home direto também.

## Links das redes (na página)
- Instagram: `https://www.instagram.com/boldstudiobrasil?igsh=MWoxYmI5NG5iYXRhbg==` ✅
- E-mail: `bold@boldstudiobrasil.com` ✅
- **Facebook: PENDENTE** (placeholder `#`)
- **WhatsApp: PENDENTE** (placeholder `#`)

## Próximos passos (aguardando Kaio)
1. Kaio enviar os links de **Facebook** e **WhatsApp** → plugar nos botões, rebuild + redeploy. Se não tiver Facebook, decidir remover o botão.
2. Quando o site oficial estiver pronto: reverter `RootGate` pra `<LandingPage />` (e remover/ajustar a rota /home).

## Observação (não relacionada, mesma sessão)
- Pela manhã: apresentação de encerramento da Immunewell pro Rogério (ver `clientes-contexto/immunewell/contexto/SAVE-150`). Kaio cogitou pôr aquele HTML num widget Elementor mas pausou ("deixa quieto") — alerta: aquele arquivo tem 57 senhas do grupo CWK, não pode ir em página pública.
