# Changelog

Convencao de versionamento (definida pelo cliente):
- **X.0.0** — mudancas de layout, novas paginas, mudancas estruturais
- **0.X.0** — mudancas de CSS / JavaScript / comportamento
- **0.0.X** — correcoes pontuais

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
