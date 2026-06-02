# BOLDSTUDIO — Site Map completo (v1 MVP)

Status: ✅ pronto · 🟡 existe, falta lapidar layout · 🔴 a construir

## Arquitetura de domínios
1 SPA (projeto Vercel `boldstudio_membros`) servida em todos os hosts. `src/lib/area.ts` detecta o subdomínio e o `RootGate` roteia. Cada área tem **login e layout próprios**.

| Domínio | Área | Quem acessa | Entrada (login) |
|---|---|---|---|
| `boldstudiobrasil.com` / `www` | **Institucional** | público | — (portfólio + LPs de venda) |
| `academy.boldstudiobrasil.com` | **Academy** | alunos (compraram) | 🎥 vídeo de fundo |
| `admin.boldstudiobrasil.com` | **Admin** | sócios-proprietários | ⬛ tela "ADMIN" |
| `crew.boldstudiobrasil.com` | **Crew** | equipe interna | 👥 grid de fotos |

---

## 0. AUTH — fluxo compartilhado (tema muda por subdomínio)
| URL | Página | O que é | Status |
|---|---|---|---|
| `/login` | LoginPage | Email+senha+captcha. Tema conforme área. | ✅ |
| `/2fa` | TwoFactorPage | Código 6 dígitos: e-mail / SMS / WhatsApp | ✅ |
| `/cadastro` | CadastroPage | Criar conta (nome, email, senha, whatsapp) | ✅ |
| `/recuperar-senha` | RecuperarSenhaPage | Pedir link de reset | ✅ |
| `/redefinir-senha` | RedefinirSenhaPage | Nova senha (via link do e-mail) | ✅ |

Pós-login (após 2FA) → redireciona por role: admin→`/admin`, crew→`/crew`, aluno→`/dashboard`.

---

## 1. boldstudiobrasil.com — INSTITUCIONAL (público)
| URL | Página | O que é | Status |
|---|---|---|---|
| `/` | LandingPage | Portfólio da Bold + chamada pra venda | 🟡 |
| `/curso-lp-01` (ex.) | — | LPs de venda das formações | 🔴 |
| `/checkout` | CheckoutPage | Compra do curso/formação | 🟡 |
| `/sucesso` | SucessoPage | Pós-compra | 🟡 |
| `*` | NotFoundPage | 404 | ✅ |

---

## 2. academy. — ACADEMY (role student, com compra ativa)
Layout: `AppLayout` · Guard: `ProtectedRoute` (login + 2FA + compra)
| URL | Página | O que é | Status |
|---|---|---|---|
| `/dashboard` | DashboardPage | Home do aluno: formações, progresso, continuar assistindo | 🟡 |
| `/modulo/:id` | ModuloPage | Aulas do módulo | ✅ |
| `/aula/:id` | AulaPage | Player Panda + materiais + marcar visto + comentários | ✅ |
| `/perfil` | PerfilPage | Dados, avatar, dispositivos, LGPD | 🟡 |
| `/certificado` | CertificadoPage | Certificado de conclusão | 🟡 |

**Conteúdo:** 3 formações (Equipe Bold · Professional · Dono de Produtora) → 12 módulos → ~70 aulas. Acesso por formação comprada (trilhas/tiers 🔴 a implementar no schema).

---

## 3. admin. — ADMIN (role admin)
Layout: `AdminLayout` · Guard: `ProtectedRoute requireAdmin`
| URL | Página | O que é | Status |
|---|---|---|---|
| `/admin` | AdminDashboardPage | Painel: métricas, alunos ativos (hora/dia/semana) | 🟡 |
| `/admin/modulos` · `/admin/modulos/:id` | AdminModulos… | CRUD de módulos | ✅ |
| `/admin/aulas/:id` | AdminAulaEditPage | Editar aula (Panda, materiais) | ✅ |
| `/admin/alunos` | AdminAlunosPage | Alunos, liberar acesso, promover | ✅ |
| `/admin/comentarios` | AdminComentariosPage | Moderação | ✅ |
| `/admin/dispositivos` | AdminDispositivosPage | Controle 3 aparelhos + alerta | ✅ |
| `/admin/acessos` | AdminAcessosPage | Histórico de acessos | ✅ |
| `/admin/lgpd` | — | Consentimentos + dados por aluno | 🔴 |
| `/admin/erros` | — | Erros do sistema | 🔴 |
| `/admin/links` | — | Gerar/listar links de acesso | 🔴 |
| `/admin/emails` | — | Histórico de e-mails | 🔴 |
| `/admin/crew` | — | Gestão da equipe (role crew) | 🔴 |
| `/admin/ia` | — | Uso/gasto do chat IA por aluno | 🔴 (fase 3) |

---

## 4. crew. — CREW (role crew) 🔴 a construir
Layout próprio (`CrewLayout`)
| URL | O que seria |
|---|---|
| `/crew` | Painel da equipe (tarefas, avisos) |
| `/crew/projetos` | Projetos/cases da produtora |
| `/crew/agenda` | Gravações/entregas |
| `/crew/materiais` | Assets, presets, templates internos |
| `/crew/perfil` | Perfil do membro |

---

## Backend no ar
- **Auth/2FA:** Edge Functions `send-login-otp`/`verify-login-otp` (e-mail/Resend) · `send-phone-otp`/`verify-phone-otp` (SMS+WhatsApp/Twilio Verify)
- **Tabelas:** profiles (roles student/admin/instructor/crew), modules, lessons, lesson_progress, comments, purchases, device_sessions, access_log, error_log, lgpd_consents, access_links, login_otp
- **Notificações:** `Toast.tsx` (sucesso/erro/info/aviso) global
