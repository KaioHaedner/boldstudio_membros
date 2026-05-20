-- v2.0.1: corrige RLS do bucket avatars
-- Bug: storage.foldername(name)[1] = auth.uid()::text falhava em alguns contextos do Storage,
-- bloqueando INSERT mesmo com user logado.
-- Fix: usa name LIKE auth.uid()::text || '/%' que e equivalente mas mais robusto.
-- Tambem restaura policy de SELECT (Storage RLS exige pra upsert funcionar).

drop policy if exists "avatars_insert_own"      on storage.objects;
drop policy if exists "avatars_update_own"      on storage.objects;
drop policy if exists "avatars_delete_own"      on storage.objects;
drop policy if exists "avatars_read_public"     on storage.objects;
drop policy if exists "avatars_read_authenticated" on storage.objects;

create policy "avatars_select_all"
  on storage.objects for select
  using (bucket_id = 'avatars');

create policy "avatars_insert_own"
  on storage.objects for insert to authenticated
  with check (bucket_id = 'avatars' and name like (auth.uid())::text || '/%');

create policy "avatars_update_own"
  on storage.objects for update to authenticated
  using (bucket_id = 'avatars' and name like (auth.uid())::text || '/%')
  with check (bucket_id = 'avatars' and name like (auth.uid())::text || '/%');

create policy "avatars_delete_own"
  on storage.objects for delete to authenticated
  using (bucket_id = 'avatars' and name like (auth.uid())::text || '/%');
