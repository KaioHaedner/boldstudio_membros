# Changelog — BOLDSTUDIO

## v3.0.0 — 2026-06-02 — "A virada" 🚀
Release gigante: de plataforma de aulas pra ecossistema completo (multi-área + auth forte + pagamento).

### Domínios e áreas
- Domínio oficial `boldstudiobrasil.com` conectado (Hostinger → Vercel, e-mail preservado, SSL)
- 4 subdomínios: institucional (raiz), `academy.`, `admin.`, `crew.`
- Login **temático por subdomínio**: academy (vídeo), admin (tela "ADMIN"), crew (grid equipe)
- `RootGate` roteia cada subdomínio; redirect pós-login por role

### Autenticação
- **2FA multicanal**: e-mail (Resend) + SMS + WhatsApp (Twilio Verify)
- Tela `/2fa` com escolha de canal; gating no `ProtectedRoute`
- hCaptcha no login funcionando
- Notificações (toasts) com cores por tipo em todo o fluxo de auth

### Pagamento
- **Webhook Ticto v2.0** libera o acesso automaticamente após a compra
- Cria conta, preenche perfil (nome + WhatsApp E.164), grava em `purchases`, manda e-mail de acesso
- Testado ponta a ponta (waiting_payment / authorized)

### Admin MVP
- Controle de dispositivos (limite 3 + alerta anti-pirataria)
- Histórico de acessos
- Usuário admin de teste configurado

### Login do Academy
- Vídeo do estúdio em background + painéis de vidro (form e título)

### Planejado (próximas)
- Onboarding Typeform no 1º login (preenche perfil + popup de foto) + respostas no admin
- Interior do Academy (Set, Trilhas, Rota, Arsenal, Conquistas, Evolução)
- Telas admin: LGPD, Erros, Links, Crew
- Trilhas/tiers por formação comprada

---

## v2.1.2 — 2026-05-20
Backoffice admin, layouts de login, VideoBackground, hCaptcha, revisão pt-BR.
