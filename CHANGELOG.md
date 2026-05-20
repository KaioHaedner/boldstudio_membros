# Changelog

Convencao de versionamento (definida pelo cliente):
- **X.0.0** — mudancas de layout, novas paginas, mudancas estruturais
- **0.X.0** — mudancas de CSS / JavaScript / comportamento
- **0.0.X** — correcoes pontuais

## v2.1.0 — 2026-05-20

### Comportamento / CSS (Y bump)
- **3 layouts de login pra testar** — switch live no canto inferior direito via query param `?style=`
  - `center` (anterior): glass card centralizado + LoginBackground (gradient mesh + obturador rotativo + particulas)
  - `split` (novo padrao): video da BOLD em loop a esquerda (3/5 da tela) + form a direita em fundo preto solido. Estilo Pedro Sobral / Universo Subido. Comunica visualmente "plataforma de audiovisual" desde o primeiro segundo
  - `full-video` (novo): video da BOLD em loop full screen + overlay escuro + form glass centralizado
- **Switcher fixo** "Centro / Split / Video BG" no canto inferior direito de qualquer pagina de auth — pra escolher visualmente. Sai do projeto quando voce decidir o definitivo
- Refatoracao: `AuthShell` movido pra `src/components/AuthShell.tsx`, `LoginBackground` agora interno (paginas nao precisam mais importar separado)
- Mobile-first: split vira vertical (video em cima, form embaixo) em telas < md

### Detalhes UX
- Tagline sobre o video no layout split: "BOLDSTUDIO • Audiovisual do basico ao avancado"
- Gradient escuro overlay no video pra blend com o form
- Header logo do form fica menor (h-10) no split pra manter equilibrio

---

## v2.0.1 — 2026-05-20

### Correção pontual
- **Fix:** `new row violates row-level security policy` ao subir avatar no /perfil
  - Causa: a policy de INSERT no bucket `avatars` usava `(storage.foldername(name))[1] = auth.uid()::text`. Em alguns contextos do Storage essa avaliação falhava silenciosamente
  - Solução: substituida por `name LIKE auth.uid()::text || '/%'` (mais explicita, equivalente, sem dependencia do helper `storage.foldername`)
  - Restaurada policy `avatars_select_all` (necessaria pra upsert funcionar — Storage RLS exige SELECT mesmo em bucket publico quando se faz upsert)

---

## v2.0.0 — 2026-05-20

Primeira release MAJOR pos-setup. Backoffice admin completo + paginas de fluxo de compra.

### Novas paginas (layout/estrutura)
**Admin (5 rotas novas, sob `/admin` com requireAdmin):**
- `/admin` — Dashboard com 6 metricas (modulos, aulas, alunos, vendas, comentarios pendentes, aulas concluidas)
- `/admin/modulos` — Lista + criar modulo inline + ativar/desativar/excluir
- `/admin/modulos/:id` — Editar modulo (titulo, descricao, cover, ordem, ativo) + gerenciar aulas
- `/admin/aulas/:id` — Editar aula (panda_video_id, duracao, materiais JSON dinamicos)
- `/admin/alunos` — Lista de profiles + busca + liberar acesso manual (cria purchase approved gateway=manual) + promover/rebaixar admin
- `/admin/comentarios` — Moderacao com tabs Pendentes/Aprovados, botoes aprovar/excluir

**Fluxo de compra (3 paginas publicas):**
- `/checkout` — Placeholder elegante "gateway em definicao" com glass card e LoginBackground
- `/sucesso` — Confirmacao pos-compra, alerta de verificar e-mail/spam
- `/certificado` (protegida) — Placeholder "em desenvolvimento" pra V2

**Auth:**
- `/redefinir-senha` — Nova pagina que recebe token de recovery (#access_token) e permite trocar senha. Detecta evento PASSWORD_RECOVERY do Supabase, valida HIBP, redireciona pra /dashboard apos sucesso
- `/recuperar-senha` agora redireciona pro `/redefinir-senha` no link de email (em vez do mesmo path)

### Components novos
- `AdminLayout` — Sidebar fixa esquerda com 4 secoes + mobile bottom nav + voltar ao app + logout
- Componentes de form admin reusaveis (Field, TextArea)

### Backend
- Sem migrations novas (a v1.0.0 ja preparou todas as tabelas)
- Admin opera todas as tabelas via policies `*_admin_write` ja existentes (modules, lessons, profiles, purchases, comments)

---

## v1.1.1 — 2026-05-20

### Correção pontual
- **Cursor:** removido o cursor 3D circular (dot+ring) da v1.1.0
- Substituído por **cursor nativo amarelo** (seta padrão do SO, só repintada em `#FFD712` com contorno preto)
- Mão apontando também em amarelo nos elementos clicáveis (links, botões)
- Implementação via SVG inline em `data:image/svg+xml` no CSS (sem dependência extra, escalável, funciona em todos os navegadores)
- Componente `CursorFollower.tsx` removido do projeto

---

## v1.1.0 — 2026-05-20

### Comportamento (JS)
- **HaveIBeenPwned check** ao digitar senha no /cadastro
  - Hash SHA-1 via Web Crypto, manda só os 5 primeiros chars pra `api.pwnedpasswords.com/range` (k-anonymity)
  - Servidor nunca ve a senha nem o hash completo
  - Debounce 600ms, indica visualmente: checking → safe / pwned (com count) / error
  - Bloqueia submit se senha vazou
  - Substitui a "Leaked Password Protection" do Supabase Pro ($25/mes) — feito gratis no frontend

### Visual (CSS)
- **Scrollbar amarela BOLD** com gradient `#FFD712 → #E5BE10`, glow no hover, border preto pra contraste
  - Funciona em Chromium (webkit-scrollbar) e Firefox (scrollbar-color)
- **Cursor custom 3D amarelo** (so desktop, `pointer: fine`)
  - Dot interno 8px com `mix-blend-mode: difference` (contraste em qualquer fundo)
  - Ring externo 44px com glow amarelo + sombra interna + perspective 3D que tilta conforme velocidade do mouse
  - Hover em links/botoes: ring escala 1.6x + opacidade 0.9
  - Click: dot encolhe (feedback tactile)
  - Esconde cursor nativo exceto em inputs de texto (mantem cursor de digitacao)

---

## v1.0.1 — 2026-05-20

### Correções pontuais
- **Fix:** `permission denied for function has_active_purchase` ao carregar /dashboard
  - Causa: REVOKE EXECUTE do `authenticated` (aplicado no setup pra fechar advisor) impedia que as policies RLS chamassem a função
  - Solução: movidas `is_admin()` e `has_active_purchase()` pra schema `internal` (não exposto pelo Data API), com EXECUTE pro `authenticated` — RLS funciona, mas funções não viram RPC endpoints
- **Fix:** advisor `public_bucket_allows_listing` no bucket `avatars`
  - Drop da policy de SELECT (bucket público dispensa policy explícita)

---

## v1.0.0 — 2026-05-19

Primeira versao oficial publicada. Inclui plataforma completa de membros e diferenciais visuais BOLD.

### Layout / estrutura
- **Perfil 2 colunas:** avatar 192x192 + botao upload a esquerda, dados a direita (elementos 20% menores)
- **Endereco estruturado:** CEP, rua, numero, complemento, bairro, cidade, estado, pais separados (antes era um campo unico)
- **Background interativo no /login** com gradient mesh + obturador rotativo + glassmorphism no form

### Backend
- Migration `add_structured_address_and_whatsapp` — drops `address`, adds 9 colunas
- Bucket Storage `avatars` (public read, RLS por owner)
- Helper `is_admin()` libera acesso total ao curso (bypassa `has_active_purchase`)
- Liberacao manual do email kaiohaedner2015@gmail.com com role=admin

### UX
- **Olho** pra mostrar/ocultar senha em /login, /cadastro, /perfil
- **Autocomplete via ViaCEP** ao digitar 8 dig no CEP (preenche bairro, cidade, estado, pais)
- **WhatsApp obrigatorio** no perfil (campo required NOT NULL)
- **hCaptcha** no login e cadastro (anti-bot)
- Trocado loader MP4 de `bold-logo-branco-in-out.mp4` (branco) pra `logo-animated.mp4` (versao completa)
- Favicon: simbolo obturador isolado (SVG inline, escalavel)

### Footer
- Versao mostrada no footer ("v1.0.0")

---

## v0.1.0 — 2026-05-19 (setup tecnico inicial)

- Scaffold Vite + React 19 + TypeScript
- Tailwind v4 com paleta BOLD (`#000`/`#FFD712`/`#FFF`/`#282828`)
- Schema Supabase: 6 tabelas (profiles, modules, lessons, lesson_progress, comments, purchases) com RLS
- Edge function helpers: `is_admin()`, `has_active_purchase()`
- AuthContext com Supabase (sem refresh manual)
- React Router 7 com ProtectedRoute
- Paginas: /, /login, /cadastro, /recuperar-senha, /dashboard, /modulo/:id, /aula/:id, /perfil
- SplashScreen 5s na primeira carga da sessao
- Deploy Vercel com SPA fallback
