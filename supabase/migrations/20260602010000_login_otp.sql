-- 2FA por email: codigo OTP de login (gerado/validado nas Edge Functions com service_role)
create table if not exists public.login_otp (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  code_hash text not null,
  expires_at timestamptz not null,
  consumed boolean not null default false,
  attempts int not null default 0,
  created_at timestamptz not null default now()
);
create index if not exists login_otp_user_idx on public.login_otp (user_id, created_at desc);

-- RLS habilitado SEM policies: so o service_role (Edge Functions) acessa. anon/authenticated nao leem nem escrevem.
alter table public.login_otp enable row level security;
