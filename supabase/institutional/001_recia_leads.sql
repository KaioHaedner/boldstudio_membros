-- Banco exclusivo do site institucional Bold Studio Brasil.
-- Não depende das tabelas, funções ou papéis da Academy/Admin/Crew.
create table if not exists public.recia_leads (
  id uuid primary key default gen_random_uuid(),
  nome text not null check (char_length(nome) between 1 and 120),
  whatsapp text not null check (char_length(whatsapp) between 1 and 40),
  email text not null check (char_length(email) between 3 and 254),
  cidade text check (cidade is null or char_length(cidade) <= 120),
  messages jsonb not null default '[]'::jsonb
    check (jsonb_typeof(messages) = 'array' and octet_length(messages::text) <= 4096),
  source text not null check (source in ('contact_form', 'recia_widget')),
  status text not null default 'novo'
    check (status in ('novo', 'em_contato', 'convertido', 'descartado')),
  user_agent text check (user_agent is null or char_length(user_agent) <= 512),
  created_at timestamptz not null default now()
);

create index if not exists recia_leads_created_at_idx
  on public.recia_leads (created_at desc);

alter table public.recia_leads enable row level security;
revoke all on public.recia_leads from public, anon, authenticated;
grant insert (nome, whatsapp, email, cidade, messages, source, user_agent)
  on public.recia_leads to anon;

create policy "institutional_public_lead_insert" on public.recia_leads
  for insert to anon
  with check (status = 'novo');

-- A leitura/gestão fica somente para o service_role no servidor do projeto.
-- Nunca exponha service_role no frontend ou em variáveis VITE_.
