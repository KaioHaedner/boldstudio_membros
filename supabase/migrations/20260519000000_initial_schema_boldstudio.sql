-- BOLDSTUDIO Membros — schema inicial
-- Aplicado via MCP em 2026-05-19. Tabelas + RLS + helpers + triggers.

-- ========= TABLES =========

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  avatar_url text,
  phone text,
  address text,
  role text not null default 'student' check (role in ('student','admin','instructor')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.modules (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  cover_url text,
  display_order int not null default 0,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.lessons (
  id uuid primary key default gen_random_uuid(),
  module_id uuid not null references public.modules(id) on delete cascade,
  title text not null,
  description text,
  panda_video_id text,
  materials jsonb not null default '[]'::jsonb,
  display_order int not null default 0,
  duration_sec int,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.lesson_progress (
  user_id uuid not null references auth.users(id) on delete cascade,
  lesson_id uuid not null references public.lessons(id) on delete cascade,
  watched boolean not null default false,
  watched_at timestamptz,
  percent int not null default 0 check (percent between 0 and 100),
  updated_at timestamptz not null default now(),
  primary key (user_id, lesson_id)
);

create table public.comments (
  id uuid primary key default gen_random_uuid(),
  lesson_id uuid not null references public.lessons(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  parent_id uuid references public.comments(id) on delete cascade,
  content text not null,
  approved boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.purchases (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  gateway text not null,
  transaction_id text not null,
  amount_cents int not null,
  currency text not null default 'BRL',
  status text not null check (status in ('pending','approved','refunded','chargeback')),
  granted_at timestamptz,
  raw_payload jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (gateway, transaction_id)
);

-- ========= INDEXES =========

create index lessons_module_id_idx on public.lessons (module_id);
create index lessons_module_order_idx on public.lessons (module_id, display_order);
create index lesson_progress_user_idx on public.lesson_progress (user_id);
create index comments_lesson_idx on public.comments (lesson_id, approved, created_at desc);
create index comments_parent_idx on public.comments (parent_id);
create index purchases_user_status_idx on public.purchases (user_id, status);
create index modules_active_order_idx on public.modules (active, display_order);

-- ========= updated_at TRIGGER (search_path fixo) =========

create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

create trigger trg_profiles_updated_at        before update on public.profiles        for each row execute function public.set_updated_at();
create trigger trg_modules_updated_at         before update on public.modules         for each row execute function public.set_updated_at();
create trigger trg_lessons_updated_at         before update on public.lessons         for each row execute function public.set_updated_at();
create trigger trg_lesson_progress_updated_at before update on public.lesson_progress for each row execute function public.set_updated_at();
create trigger trg_comments_updated_at        before update on public.comments        for each row execute function public.set_updated_at();
create trigger trg_purchases_updated_at       before update on public.purchases       for each row execute function public.set_updated_at();

-- ========= AUTO-CREATE PROFILE NO SIGNUP =========

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, new.raw_user_meta_data->>'full_name');
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ========= HELPERS (SECURITY DEFINER, sem EXECUTE para anon/authenticated) =========

create or replace function public.is_admin()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (select 1 from public.profiles where id = auth.uid() and role = 'admin');
$$;

create or replace function public.has_active_purchase(target_user uuid)
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1 from public.purchases
    where user_id = target_user and status = 'approved' and granted_at is not null
  );
$$;

revoke execute on function public.is_admin()                from public, anon, authenticated;
revoke execute on function public.has_active_purchase(uuid) from public, anon, authenticated;
revoke execute on function public.handle_new_user()         from public, anon, authenticated;

-- ========= ENABLE RLS =========

alter table public.profiles         enable row level security;
alter table public.modules          enable row level security;
alter table public.lessons          enable row level security;
alter table public.lesson_progress  enable row level security;
alter table public.comments         enable row level security;
alter table public.purchases        enable row level security;

-- ========= POLICIES =========

-- profiles
create policy "profiles_select_own_or_admin" on public.profiles for select to authenticated
  using (auth.uid() = id or public.is_admin());
create policy "profiles_update_own" on public.profiles for update to authenticated
  using (auth.uid() = id) with check (auth.uid() = id);
create policy "profiles_admin_write" on public.profiles for all to authenticated
  using (public.is_admin()) with check (public.is_admin());

-- modules
create policy "modules_select_paid_or_admin" on public.modules for select to authenticated
  using (active = true and (public.has_active_purchase(auth.uid()) or public.is_admin()));
create policy "modules_admin_write" on public.modules for all to authenticated
  using (public.is_admin()) with check (public.is_admin());

-- lessons
create policy "lessons_select_paid_or_admin" on public.lessons for select to authenticated
  using (active = true and (public.has_active_purchase(auth.uid()) or public.is_admin()));
create policy "lessons_admin_write" on public.lessons for all to authenticated
  using (public.is_admin()) with check (public.is_admin());

-- lesson_progress
create policy "progress_select_own_or_admin" on public.lesson_progress for select to authenticated
  using (auth.uid() = user_id or public.is_admin());
create policy "progress_insert_own" on public.lesson_progress for insert to authenticated
  with check (auth.uid() = user_id);
create policy "progress_update_own" on public.lesson_progress for update to authenticated
  using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- comments
create policy "comments_select_approved_or_own" on public.comments for select to authenticated
  using ((approved = true and public.has_active_purchase(auth.uid())) or auth.uid() = user_id or public.is_admin());
create policy "comments_insert_own_paid" on public.comments for insert to authenticated
  with check (auth.uid() = user_id and public.has_active_purchase(auth.uid()));
create policy "comments_update_own_or_admin" on public.comments for update to authenticated
  using (auth.uid() = user_id or public.is_admin())
  with check (auth.uid() = user_id or public.is_admin());
create policy "comments_delete_own_or_admin" on public.comments for delete to authenticated
  using (auth.uid() = user_id or public.is_admin());

-- purchases
create policy "purchases_select_own_or_admin" on public.purchases for select to authenticated
  using (auth.uid() = user_id or public.is_admin());
create policy "purchases_admin_write" on public.purchases for all to authenticated
  using (public.is_admin()) with check (public.is_admin());
