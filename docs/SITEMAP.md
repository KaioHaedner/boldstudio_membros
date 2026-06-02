# BOLDSTUDIO — Site Map (v1 MVP)

Status: ✅ existe · 🟡 existe parcial · 🔴 a construir

## Mapeamento de domínios (Vercel + Hostinger)
Hoje é **1 SPA** (projeto `boldstudio_membros`) servida em todos os hosts; as rotas resolvem em qualquer subdomínio. O refino (cada subdomínio abrir sua área) entra depois.

| Domínio | Área | Papel (role) |
|---|---|---|
| `boldstudiobrasil.com` / `www` | Institucional + LP de vendas + entrada (login) | público |
| `app.boldstudiobrasil.com` | **Academy** (área do aluno) | student |
| `admin.boldstudiobrasil.com` | **Admin** (backoffice) | admin |
| `crew.boldstudiobrasil.com` 🔴 | **Crew** (equipe interna Bold) | crew |

---

## 1. PÚBLICO (sem login)
| URL | Página | O que é | Status |
|---|---|---|---|
| `/` | LandingPage | Institucional + LP de vendas do curso | ✅ |
| `/login` | LoginPage | Email + senha + captcha (layout vídeo + vidro) | ✅ |
| `/2fa` | TwoFactorPage | Código por e-mail / SMS / WhatsApp | ✅ |
| `/cadastro` | CadastroPage | Criar conta (nome, email, senha, whatsapp…) | ✅ |
| `/recuperar-senha` | RecuperarSenhaPage | Pedir reset por e-mail | ✅ |
| `/redefinir-senha` | RedefinirSenhaPage | Definir nova senha (via link do e-mail) | ✅ |
| `/checkout` | CheckoutPage | Compra do curso/formação | 🟡 |
| `/sucesso` | SucessoPage | Pós-compra | 🟡 |
| `*` | NotFoundPage | 404 | ✅ |

---

## 2. ACADEMY — área do aluno (login + 2FA + compra ativa)
Layout: `AppLayout` · Guard: `ProtectedRoute`
| URL | Página | O que é | Status |
|---|---|---|---|
| `/dashboard` | DashboardPage | Home do aluno: trilhas/formações, progresso, continuar assistindo | 🟡 |
| `/modulo/:id` | ModuloPage | Lista de aulas do módulo | ✅ |
| `/aula/:id` | AulaPage | Player (Panda), materiais, marcar como visto, comentários | ✅ |
| `/perfil` | PerfilPage | Dados, avatar, dispositivos, LGPD | 🟡 |
| `/certificado` | CertificadoPage | Certificado de conclusão | 🟡 |

**Conteúdo (navegação dinâmica):** 3 formações (Equipe Bold · Professional · Dono de Produtora) → 12 módulos → ~70 aulas. Acesso por formação comprada (a implementar no schema: trilhas/tiers).

---

## 3. ADMIN — backoffice (role admin)
Layout: `AdminLayout` · Guard: `ProtectedRoute requireAdmin`
| URL | Página | O que é | Status |
|---|---|---|---|
| `/admin` | AdminDashboardPage | Métricas, alunos ativos (hora/dia/semana) | 🟡 |
| `/admin/modulos` | AdminModulosListPage | CRUD de módulos | ✅ |
| `/admin/modulos/:id` | AdminModuloEditPage | Editar módulo | ✅ |
| `/admin/aulas/:id` | AdminAulaEditPage | Editar aula (Panda, materiais) | ✅ |
| `/admin/alunos` | AdminAlunosPage | Alunos, liberar acesso, promover | ✅ |
| `/admin/comentarios` | AdminComentariosPage | Moderar comentários | ✅ |
| `/admin/dispositivos` | AdminDispositivosPage | Controle 3 aparelhos + alerta anti-pirataria | ✅ |
| `/admin/acessos` | AdminAcessosPage | Histórico de acessos | ✅ |
| `/admin/lgpd` | — | Consentimentos + dados pessoais por aluno | 🔴 |
| `/admin/erros` | — | Erros do sistema (estilo AgroNortão) | 🔴 |
| `/admin/links` | — | Gerar/listar links de acesso | 🔴 |
| `/admin/emails` | — | Histórico de e-mails enviados | 🔴 |
| `/admin/crew` | — | Gestão da equipe interna (role crew) | 🔴 |
| `/admin/ia` | — | Uso/gasto do chat IA por aluno | 🔴 (fase 3) |

---

## 4. CREW — equipe interna Bold (role crew) 🔴 a construir
Layout próprio (`CrewLayout`). Proposta inicial:
| URL | O que seria |
|---|---|
| `/crew` | Painel da equipe (tarefas, avisos) |
| `/crew/projetos` | Projetos/cases da produtora |
| `/crew/agenda` | Agenda de gravações/entregas |
| `/crew/materiais` | Assets, presets, templates internos |
| `/crew/perfil` | Perfil do membro da equipe |

---

## Backend já no ar (Edge Functions + tabelas)
- **2FA:** `send-login-otp`, `verify-login-otp` (e-mail/Resend) · `send-phone-otp`, `verify-phone-otp` (SMS/WhatsApp/Twilio)
- **Tabelas admin MVP:** `device_sessions`, `access_log`, `error_log`, `lgpd_consents`, `access_links`, `login_otp`
- **Schema base:** `profiles` (roles: student/admin/instructor/crew), `modules`, `lessons`, `lesson_progress`, `comments`, `purchases`
