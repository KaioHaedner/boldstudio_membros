-- v1.0.1: fix permission denied + harden security
-- Move helpers SECURITY DEFINER de public pra internal schema
-- (nao exposto pelo Data API, mas usavel em RLS policies).
-- Tambem dropa policy de SELECT do bucket avatars (bucket public=true ja basta).

create schema if not exists internal;

create or replace function internal.is_admin()
returns boolean language sql security definer set search_path = public stable
as $$
  select exists (select 1 from public.profiles where id = auth.uid() and role = 'admin');
$$;

create or replace function internal.has_active_purchase(target_user uuid)
returns boolean language sql security definer set search_path = public stable
as $$
  select exists (
    select 1 from public.purchases
    where user_id = target_user and status = 'approved' and granted_at is not null
  );
$$;

grant usage on schema internal to authenticated, anon;
grant execute on function internal.is_admin()                to authenticated;
grant execute on function internal.has_active_purchase(uuid) to authenticated;

-- Recria todas as policies usando internal.*
drop policy if exists "profiles_select_own_or_admin" on public.profiles;
drop policy if exists "profiles_admin_write"         on public.profiles;
drop policy if exists "modules_select_paid_or_admin" on public.modules;
drop policy if exists "modules_admin_write"          on public.modules;
drop policy if exists "lessons_select_paid_or_admin" on public.lessons;
drop policy if exists "lessons_admin_write"          on public.lessons;
drop policy if exists "progress_select_own_or_admin" on public.lesson_progress;
drop policy if exists "comments_select_approved_or_own" on public.comments;
drop policy if exists "comments_insert_own_paid"      on public.comments;
drop policy if exists "comments_update_own_or_admin"  on public.comments;
drop policy if exists "comments_delete_own_or_admin"  on public.comments;
drop policy if exists "purchases_select_own_or_admin" on public.purchases;
drop policy if exists "purchases_admin_write"         on public.purchases;

create policy "profiles_select_own_or_admin" on public.profiles for select to authenticated
  using (auth.uid() = id or internal.is_admin());
create policy "profiles_admin_write" on public.profiles for all to authenticated
  using (internal.is_admin()) with check (internal.is_admin());

create policy "modules_select_paid_or_admin" on public.modules for select to authenticated
  using (active = true and (internal.has_active_purchase(auth.uid()) or internal.is_admin()));
create policy "modules_admin_write" on public.modules for all to authenticated
  using (internal.is_admin()) with check (internal.is_admin());

create policy "lessons_select_paid_or_admin" on public.lessons for select to authenticated
  using (active = true and (internal.has_active_purchase(auth.uid()) or internal.is_admin()));
create policy "lessons_admin_write" on public.lessons for all to authenticated
  using (internal.is_admin()) with check (internal.is_admin());

create policy "progress_select_own_or_admin" on public.lesson_progress for select to authenticated
  using (auth.uid() = user_id or internal.is_admin());

create policy "comments_select_approved_or_own" on public.comments for select to authenticated
  using ((approved = true and internal.has_active_purchase(auth.uid())) or auth.uid() = user_id or internal.is_admin());
create policy "comments_insert_own_paid" on public.comments for insert to authenticated
  with check (auth.uid() = user_id and internal.has_active_purchase(auth.uid()));
create policy "comments_update_own_or_admin" on public.comments for update to authenticated
  using (auth.uid() = user_id or internal.is_admin())
  with check (auth.uid() = user_id or internal.is_admin());
create policy "comments_delete_own_or_admin" on public.comments for delete to authenticated
  using (auth.uid() = user_id or internal.is_admin());

create policy "purchases_select_own_or_admin" on public.purchases for select to authenticated
  using (auth.uid() = user_id or internal.is_admin());
create policy "purchases_admin_write" on public.purchases for all to authenticated
  using (internal.is_admin()) with check (internal.is_admin());

drop function if exists public.is_admin();
drop function if exists public.has_active_purchase(uuid);
drop policy   if exists "avatars_read_public" on storage.objects;
