-- BOLDSTUDIO — RecIA Leads (2026-06-16)
-- Leads capturados pelo widget RecIA na home institucional publica.
-- O visitante e ANONIMO (role anon), entao o INSERT e liberado para anon;
-- a leitura/gestao fica admin-only via internal.is_admin(), como nas demais tabelas.

create table if not exists public.recia_leads (
  id uuid primary key default gen_random_uuid(),
  nome text not null,
  whatsapp text not null,
  email text not null,
  cidade text,                                   -- cidade e estado (ex.: "Sinop - MT")
  messages jsonb not null default '[]'::jsonb,    -- historico da conversa (fase IA real, append server-side)
  source text not null default 'recia_widget',
  status text not null default 'novo' check (status in ('novo','em_contato','convertido','descartado')),
  user_agent text,
  created_at timestamptz not null default now()
);
create index if not exists recia_leads_created_idx on public.recia_leads (created_at desc);
create index if not exists recia_leads_status_idx on public.recia_leads (status);

-- ========= GRANTS (RLS faz o gating real) =========
grant insert on public.recia_leads to anon, authenticated;
grant select, update, delete on public.recia_leads to authenticated;

-- ========= ENABLE RLS =========
alter table public.recia_leads enable row level security;

-- ========= POLICIES =========
-- Qualquer visitante (anon) pode criar um lead pela home publica.
create policy "recia_insert_public" on public.recia_leads for insert to anon, authenticated
  with check (true);

-- So admin le e gerencia os leads.
create policy "recia_select_admin" on public.recia_leads for select to authenticated
  using (internal.is_admin());
create policy "recia_update_admin" on public.recia_leads for update to authenticated
  using (internal.is_admin()) with check (internal.is_admin());
create policy "recia_delete_admin" on public.recia_leads for delete to authenticated
  using (internal.is_admin());
