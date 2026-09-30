-- ============================================================================
-- Outskyz — Phase 2 auth hardening (RUN MANUALLY in Supabase SQL Editor)
-- ============================================================================
--
-- WHY THIS IS NOT APPLIED AUTOMATICALLY
-- The old schema.sql hardcoded a personal email as the admin bootstrap and
-- was not idempotent. This replaces that with an explicit allowlist you
-- control, and is safe to re-run.
--
-- Review, then paste into: Supabase Dashboard -> SQL Editor -> New query
-- ============================================================================


-- 1. ADMIN ALLOWLIST (replaces the hardcoded-email bootstrap)
--    To grant admin later:   INSERT a row, then re-run step 2.
--    To revoke:              DELETE the row, then re-run step 2.
create table if not exists public.admin_allowlist (
  email text primary key,
  created_at timestamptz default now()
);

insert into public.admin_allowlist (email)
values ('vivekganwal2004@gmail.com')
on conflict (email) do nothing;
-- ^ REPLACE the address above with your real admin email(s).


-- 2. SYNC profiles.is_admin FROM THE ALLOWLIST
create or replace function public.sync_admin_from_allowlist()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  update public.profiles
     set is_admin = exists (
       select 1 from public.admin_allowlist a
        where lower(a.email) = lower(new.email)
     )
   where id = new.id;
  return new;
end;
$$;

drop trigger if exists on_auth_user_admin_sync on auth.users;
create trigger on_auth_user_admin_sync
  after insert on auth.users
  for each row execute procedure public.sync_admin_from_allowlist();


-- Backfill profiles created before this change.
update public.profiles p
   set is_admin = exists (
     select 1 from public.admin_allowlist a where lower(a.email) = lower(p.email)
   );


-- 3. NEW SIGNUPS NO LONGER DECIDE ADMIN STATUS
--    handle_new_user() still creates the profile, always with is_admin=false.
--    The allowlist trigger above is the only thing that grants admin.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name, is_admin)
  values (new.id, new.email, new.raw_user_meta_data->>'full_name', false)
  on conflict (id) do nothing;
  return new;
end;
$$;


-- 4. RLS ON THE ALLOWLIST
--    Intentionally NO policies: with RLS enabled and zero policies, anon and
--    authenticated have no access at all. The security-definer triggers still
--    work because they execute as the table owner.
alter table public.admin_allowlist enable row level security;


-- 5. HARDEN PROFILES (defence in depth)
--    Only the owner may read their own row, and nobody may change is_admin
--    from the browser. The allowlist trigger bypasses RLS to grant admin.
drop policy if exists "Users can view own profile" on public.profiles;
drop policy if exists "Users can update own profile" on public.profiles;

create policy "Users can view own profile"
  on public.profiles for select
  using (auth.uid() = id);

-- with_check blocks a user from escalating is_admin on their own row.
create policy "Users can update own profile (not admin)"
  on public.profiles for update
  using (auth.uid() = id)
  with check (auth.uid() = id and is_admin = false);

drop trigger if exists protect_profile_role on public.profiles;
create or replace function public.protect_profile_role()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  if auth.role() <> 'service_role'
     and new.is_admin is distinct from old.is_admin then
    raise exception 'Only the service role can change an admin role';
  end if;
  return new;
end;
$$;
create trigger protect_profile_role before update on public.profiles
  for each row execute procedure public.protect_profile_role();


-- 6. SUPABASE STORAGE POLICIES (optional)
--    No Storage bucket or policy existed. Team photos currently live in
--    /public, so only run this if you move uploads to Supabase Storage.
--    Replace 'outskyz-media' with your bucket name.
--
-- insert into storage.buckets (id, name, public)
-- values ('outskyz-media', 'outskyz-media', true)
-- on conflict (id) do nothing;
--
-- -- Public site images: anyone may read, only admins may write.
-- drop policy if exists "Public can read outskyz-media" on storage.objects;
-- create policy "Public can read outskyz-media"
--   on storage.objects for select
--   using (bucket_id = 'outskyz-media');
--
-- drop policy if exists "Admins can insert into outskyz-media" on storage.objects;
-- create policy "Admins can insert into outskyz-media"
--   on storage.objects for insert
--   with check (
--     bucket_id = 'outskyz-media'
--     and exists (select 1 from public.profiles
--                  where id = auth.uid() and is_admin = true)
--   );
--
-- drop policy if exists "Admins can update outskyz-media" on storage.objects;
-- create policy "Admins can update outskyz-media"
--   on storage.objects for update
--   using (
--     bucket_id = 'outskyz-media'
--     and exists (select 1 from public.profiles
--                  where id = auth.uid() and is_admin = true)
--   );
--
-- drop policy if exists "Admins can delete from outskyz-media" on storage.objects;
-- create policy "Admins can delete from outskyz-media"
--   on storage.objects for delete
--   using (
--     bucket_id = 'outskyz-media'
--     and exists (select 1 from public.profiles
--                  where id = auth.uid() and is_admin = true)
--   );


-- 7. VERIFY
--    Expect only allowlisted rows as true:
--      select email, is_admin from public.profiles order by email;
--
--    Confirm RLS is on everywhere (every row should be true):
--      select tablename, rowsecurity
--        from pg_tables
--       where schemaname = 'public'
--       order by tablename;

