# SAVE-152 — 2026-06-02 — BOLDSTUDIO v3.0.0 (sessão massiva)

De plataforma de aulas → ecossistema completo num dia. Repo `boldstudio_membros` (Vercel `prj_UNyg5DWUTH2xqm9xUXmZBHE1OBlr`).

## Infra (detalhes em memória `reference_boldstudio_infra`)
- **Domínio** boldstudiobrasil.com conectado (Hostinger→Vercel, email preservado, SSL)
- **4 subdomínios**: raiz (institucional), `academy.` (aluno), `admin.` (sócios), `crew.` (equipe). `src/lib/area.ts` detecta + `RootGate` roteia. Login temático por área.
- hCaptcha RESOLVIDO: sitekey `be32d4ec-...` (env Vercel) + secret `ES_e1da0f38...` (Supabase)

## Feito nesta sessão
1. **2FA multicanal**: email (Resend) + SMS/WhatsApp (Twilio Verify). Edge Functions send/verify-login-otp e send/verify-phone-otp. Tela `/2fa` escolhe canal. Twilio TRIAL (SMS BR restrito, WhatsApp melhor).
2. **Notificações** (`Toast.tsx`): cores por tipo, em todo auth + ações admin.
3. **Admin MVP completo**: Dispositivos (limite 3+alerta), Acessos, LGPD, Erros, Links de acesso. Sidebar + rotas. Migration `admin_mvp` aplicada (device_sessions, access_log, error_log, lgpd_consents, access_links). Role `crew` (era worker). Admin teste: kaiohaedner2015@gmail.com / KGomes_@17.
4. **Pagamento Ticto** (webhook v2.0): Edge Function `webhook-ticto` libera acesso (cria aluno + perfil + purchases + email). TESTADO ponta a ponta (waiting_payment=pending, authorized=libera). Token Ticto + secret no Supabase.
5. **Interior do Academy**: nav topo Set/Trilhas/Rota/Arsenal/Conquistas/Evolução/Perfil. Trilhas (módulos reais), Evolução (progresso real); Rota/Arsenal/Conquistas estruturais.
6. **Footer + páginas legais**: `/termos` `/privacidade` `/cookies` `/suporte` + Footer (no AppLayout).
7. **Componentes externos adaptados** (do usuário): botões 3D de navegação (AulaPage), selo brutalist "Powered By Kaio H. & BoldStudio" (obturador Aperture, cores Bold).
8. **Login**: testou tema "câmera" (emissor de luz), REVERTEU pros temas por área. Academy ficou: vídeo BG + card glass borda amarela + "bold. Academy" (sem "Entrar") + selo (88px) + texto Bold canto inferior.

## ROADMAP — features a extrair das areas de membros de referencia
Analisado ECOM Club + Universo Subido (Pedro Sobral). Prioridade:
1. 🔥 **Sidebar de aulas com ✓ verde** ao lado do player (lista aulas do módulo, marca concluídas) — AulaPage
2. 🔥 **IA de estudo na aula** ("AI.LA"): "gere perguntas da aula" / "tire dúvida" — casa com o chat IA da Bold planejado. DIFERENCIAL
3. 🔥 **Avaliar aula (estrelas) + Favoritar + tab Downloads/Materiais**
4. 🔥 **Filtros Todos/Em andamento/Concluídos** nas Trilhas + **busca global**
5. 🔥 **Gamificação** (troféu/premiações por progresso)
6. 🟡 Notificações (sino) + perfil dropdown no header, breadcrumbs, barras de progresso por curso/módulo

## Pendências
- [ ] ROTACIONAR chaves (Supabase, Hostinger, Vercel, Resend, Twilio, Ticto) — todas no chat
- [ ] Onboarding Typeform (1º login: personalização + perfil auto + popup foto, respostas no admin) — planejado, perguntas/campos aprovados a definir
- [ ] Site institucional (boldstudiobrasil.com + LPs venda /curso-lp-01 ligadas ao checkout Ticto)
- [ ] Crew (área interna)
- [ ] Trilhas/tiers por formação comprada (Equipe Bold/Professional/Dono)
- [ ] Features do roadmap acima

## Diagrama Figma (mapa de redirecionamentos)
figma.com/board/aT6WVrEWQn6atGvIdyZ7mo
