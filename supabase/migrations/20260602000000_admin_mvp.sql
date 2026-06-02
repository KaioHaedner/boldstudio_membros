-- BOLDSTUDIO — Admin MVP (2026-06-02)
-- Tabelas de operacao do painel: dispositivos (anti-pirataria 3+alerta),
-- consentimento LGPD, historico de acessos, erros do sistema e links de acesso.
-- Segue o padrao do schema: helpers em internal.*, RLS admin-only via internal.is_admin().

-- ========= PROFILES: role worker + campos de contato/LGPD =========
alter table public.profiles drop constraint if exists profiles_role_check;
alter table public.profiles
  add constraint profiles_role_check check (role in ('student','admin','instructor','crew'));

alter table public.profiles add column if not exists cpf text;
-- (whatsapp, phone e address ja existem)

-- ========= DEVICE SESSIONS (limite de 3 por usuario + alerta) =========
create table if not exists public.device_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  device_id text not null,
  device_label text,
  device_type text,            -- mobile | desktop | notebook | tablet
  ip text,
  city text,
  user_agent text,
  last_seen_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  unique (user_id, device_id)
);
create index if not exists device_sessions_user_idx on public.device_sessions (user_id, last_seen_at desc);

-- ========= LGPD CONSENTS (append-only, historico de aceite) =========
create table if not exists public.lgpd_consents (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  consent_type text not null,            -- terms | data_sharing | marketing
  terms_version text not null default 'v1',
  accepted boolean not null,
  ip text,
  user_agent text,
  created_at timestamptz not null default now()
);
create index if not exists lgpd_consents_user_idx on public.lgpd_consents (user_id, created_at desc);

-- ========= ACCESS LOG (historico de acessos) =========
create table if not exists public.access_log (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  email text,
  action text not null,                  -- login | logout | password_reset | ...
  ip text,
  city text,
  user_agent text,
  created_at timestamptz not null default now()
);
create index if not exists access_log_created_idx on public.access_log (created_at desc);
create index if not exists access_log_user_idx on public.access_log (user_id, created_at desc);

-- ========= ERROR LOG (erros do sistema, igual AgroNortao) =========
create table if not exists public.error_log (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  message text not null,
  stack text,
  url text,
  user_agent text,
  created_at timestamptz not null default now()
);
create index if not exists error_log_created_idx on public.error_log (created_at desc);

-- ========= ACCESS LINKS (links de acesso gerados) =========
create table if not exists public.access_links (
  id uuid primary key default gen_random_uuid(),
  token text not null unique,
  created_by uuid references auth.users(id) on delete set null,
  label text,
  role_granted text not null default 'student' check (role_granted in ('student','crew','instructor','admin')),
  intended_email text,
  expires_at timestamptz,
  max_uses int not null default 1,
  used_count int not null default 0,
  used_by uuid references auth.users(id) on delete set null,
  used_at timestamptz,
  created_at timestamptz not null default now()
);
create index if not exists access_links_created_idx on public.access_links (created_at desc);

-- ========= updated_at em device_sessions (reusa o trigger existente) =========
-- (device_sessions usa last_seen_at; as demais sao append-only, sem trigger)

-- ========= GRANTS (RLS faz o gating real) =========
grant select, insert, update, delete on public.device_sessions to authenticated;
grant select, insert on public.lgpd_consents to authenticated;
grant select, insert on public.access_log to authenticated;
grant select, insert on public.error_log to authenticated;
grant select, insert, update, delete on public.access_links to authenticated;

-- ========= ENABLE RLS =========
alter table public.device_sessions enable row level security;
alter table public.lgpd_consents   enable row level security;
alter table public.access_log      enable row level security;
alter table public.error_log       enable row level security;
alter table public.access_links    enable row level security;

-- ========= POLICIES =========

-- device_sessions: usuario gerencia os seus; admin ve/gerencia todos
create policy "device_select_own_or_admin" on public.device_sessions for select to authenticated
  using (auth.uid() = user_id or internal.is_admin());
create policy "device_insert_own" on public.device_sessions for insert to authenticated
  with check (auth.uid() = user_id);
create policy "device_update_own_or_admin" on public.device_sessions for update to authenticated
  using (auth.uid() = user_id or internal.is_admin())
  with check (auth.uid() = user_id or internal.is_admin());
create policy "device_delete_own_or_admin" on public.device_sessions for delete to authenticated
  using (auth.uid() = user_id or internal.is_admin());

-- lgpd_consents: usuario registra o seu aceite e ve o proprio; admin ve tudo (sem update/delete: append-only)
create policy "lgpd_select_own_or_admin" on public.lgpd_consents for select to authenticated
  using (auth.uid() = user_id or internal.is_admin());
create policy "lgpd_insert_own" on public.lgpd_consents for insert to authenticated
  with check (auth.uid() = user_id);

-- access_log: qualquer autenticado registra o proprio evento; so admin le
create policy "access_log_insert_self" on public.access_log for insert to authenticated
  with check (user_id is null or auth.uid() = user_id);
create policy "access_log_select_admin" on public.access_log for select to authenticated
  using (internal.is_admin());

-- error_log: qualquer autenticado registra; so admin le
create policy "error_log_insert_any" on public.error_log for insert to authenticated
  with check (true);
create policy "error_log_select_admin" on public.error_log for select to authenticated
  using (internal.is_admin());

-- access_links: somente admin (geracao/listagem). Redencao sera via edge function depois.
create policy "access_links_admin_all" on public.access_links for all to authenticated
  using (internal.is_admin()) with check (internal.is_admin());
