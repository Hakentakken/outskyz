-- Outskyz Database Schema
-- Run this in Supabase SQL Editor

-- ============================================
-- PROFILES (extends auth.users)
-- ============================================
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade primary key,
  email text unique not null,
  full_name text,
  phone text,
  is_admin boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.profiles enable row level security;

create policy "Users can view own profile"
  on public.profiles for select using (auth.uid() = id);

create policy "Users can update own profile"
  on public.profiles for update using (auth.uid() = id);

create or replace function public.protect_profile_role()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  if auth.role() <> 'service_role' and new.is_admin is distinct from old.is_admin then
    raise exception 'Only the service role can change an admin role';
  end if;
  return new;
end;
$$;

drop trigger if exists protect_profile_role on public.profiles;
create trigger protect_profile_role before update on public.profiles
for each row execute procedure public.protect_profile_role();

-- ============================================
-- ADVENTURES (admin-managed)
-- ============================================
create table if not exists public.adventures (
  id uuid default gen_random_uuid() primary key,
  slug text unique not null,
  number text,
  title text not null,
  short_description text,
  description text,
  category text,
  category_label text,
  image text,
  difficulty text,
  duration text,
  age_limit text,
  location text,
  overview text,
  price numeric(12,2) default 0,
  currency text default 'USD',
  is_active boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.adventures enable row level security;

create policy "Adventures are viewable by everyone"
  on public.adventures for select using (true);

create policy "Admins can insert adventures"
  on public.adventures for insert with check (
    exists (select 1 from public.profiles where id = auth.uid() and is_admin = true)
  );

create policy "Admins can update adventures"
  on public.adventures for update using (
    exists (select 1 from public.profiles where id = auth.uid() and is_admin = true)
  );

create policy "Admins can delete adventures"
  on public.adventures for delete using (
    exists (select 1 from public.profiles where id = auth.uid() and is_admin = true)
  );

-- ============================================
-- DESTINATIONS (admin-managed)
-- ============================================
create table if not exists public.destinations (
  id uuid default gen_random_uuid() primary key,
  slug text unique not null,
  name text not null,
  country text,
  short_description text,
  description text,
  image text,
  adventure_count integer default 0,
  is_active boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.destinations enable row level security;

create policy "Destinations are viewable by everyone"
  on public.destinations for select using (true);

create policy "Admins can insert destinations"
  on public.destinations for insert with check (
    exists (select 1 from public.profiles where id = auth.uid() and is_admin = true)
  );

create policy "Admins can update destinations"
  on public.destinations for update using (
    exists (select 1 from public.profiles where id = auth.uid() and is_admin = true)
  );

create policy "Admins can delete destinations"
  on public.destinations for delete using (
    exists (select 1 from public.profiles where id = auth.uid() and is_admin = true)
  );

-- ============================================
-- PACKAGES (admin-managed)
-- ============================================
create table if not exists public.packages (
  id uuid default gen_random_uuid() primary key,
  slug text unique not null,
  name text not null,
  description text,
  destination text,
  duration text,
  duration_days integer,
  price numeric(12,2) default 0,
  currency text default 'USD',
  image text,
  group_size text,
  overview text,
  is_active boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.packages enable row level security;

create policy "Packages are viewable by everyone"
  on public.packages for select using (true);

create policy "Admins can insert packages"
  on public.packages for insert with check (
    exists (select 1 from public.profiles where id = auth.uid() and is_admin = true)
  );

create policy "Admins can update packages"
  on public.packages for update using (
    exists (select 1 from public.profiles where id = auth.uid() and is_admin = true)
  );

create policy "Admins can delete packages"
  on public.packages for delete using (
    exists (select 1 from public.profiles where id = auth.uid() and is_admin = true)
  );

-- ============================================
-- GALLERY IMAGES (admin-managed)
-- ============================================
create table if not exists public.gallery_images (
  id uuid default gen_random_uuid() primary key,
  src text not null,
  alt text,
  category text,
  category_label text,
  is_active boolean default true,
  created_at timestamptz default now()
);

alter table public.gallery_images enable row level security;
create unique index if not exists gallery_images_src_key on public.gallery_images (src);

create policy "Gallery images are viewable by everyone"
  on public.gallery_images for select using (true);

create policy "Admins can insert gallery images"
  on public.gallery_images for insert with check (
    exists (select 1 from public.profiles where id = auth.uid() and is_admin = true)
  );

create policy "Admins can update gallery images"
  on public.gallery_images for update using (
    exists (select 1 from public.profiles where id = auth.uid() and is_admin = true)
  );

create policy "Admins can delete gallery images"
  on public.gallery_images for delete using (
    exists (select 1 from public.profiles where id = auth.uid() and is_admin = true)
  );

-- ============================================
-- CART ITEMS
-- ============================================
create table if not exists public.cart_items (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null,
  item_type text not null check (item_type in ('adventure', 'package')),
  item_id uuid not null,
  item_slug text not null,
  item_name text not null,
  item_image text,
  quantity integer default 1,
  unit_price numeric(12,2) default 0,
  currency text default 'USD',
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique (user_id, item_type, item_id)
);

alter table public.cart_items enable row level security;

create policy "Users can view own cart"
  on public.cart_items for select using (auth.uid() = user_id);

create policy "Users can insert own cart items"
  on public.cart_items for insert with check (auth.uid() = user_id);

create policy "Users can update own cart items"
  on public.cart_items for update using (auth.uid() = user_id);

create policy "Users can delete own cart items"
  on public.cart_items for delete using (auth.uid() = user_id);

-- ============================================
-- ORDERS
-- ============================================
create table if not exists public.orders (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null,
  order_number text unique not null,
  status text default 'pending' check (status in ('pending', 'paid', 'failed', 'cancelled', 'completed')),
  payment_provider text default 'razorpay',
  razorpay_order_id text unique,
  payment_id text,
  payment_signature text,
  total_amount numeric(12,2) default 0,
  currency text default 'USD',
  customer_name text,
  customer_email text,
  customer_phone text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.orders enable row level security;

create policy "Users can view own orders"
  on public.orders for select using (auth.uid() = user_id);

create policy "Admins can view all orders"
  on public.orders for select using (
    exists (select 1 from public.profiles where id = auth.uid() and is_admin = true)
  );

create policy "Users can insert own orders"
  on public.orders for insert with check (auth.uid() = user_id);

create policy "Admins can update orders"
  on public.orders for update using (
    exists (select 1 from public.profiles where id = auth.uid() and is_admin = true)
  );

-- ============================================
-- ORDER ITEMS
-- ============================================
create table if not exists public.order_items (
  id uuid default gen_random_uuid() primary key,
  order_id uuid references public.orders on delete cascade not null,
  item_type text not null check (item_type in ('adventure', 'package')),
  item_slug text not null,
  item_name text not null,
  item_image text,
  quantity integer default 1,
  unit_price numeric(12,2) default 0,
  currency text default 'USD',
  created_at timestamptz default now()
);

alter table public.order_items enable row level security;

create policy "Users can view own order items"
  on public.order_items for select using (
    exists (
      select 1 from public.orders
      where orders.id = order_items.order_id and orders.user_id = auth.uid()
    )
  );

create policy "Admins can view all order items"
  on public.order_items for select using (
    exists (select 1 from public.profiles where id = auth.uid() and is_admin = true)
  );

create policy "Users can insert own order items"
  on public.order_items for insert with check (
    exists (
      select 1 from public.orders
      where orders.id = order_items.order_id and orders.user_id = auth.uid()
    )
  );

-- ============================================
-- TRIGGERS
-- ============================================

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name, is_admin)
  values (
    new.id,
    new.email,
    new.raw_user_meta_data->>'full_name',
    lower(new.email) = 'vivekganwal2004@gmail.com'
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Set admin for vivekganwal2004@gmail.com
create or replace function public.set_admin_for_vivek()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  if new.email = 'vivekganwal2004@gmail.com' then
    update public.profiles set is_admin = true where id = new.id;
  end if;
  return new;
end;
$$;

drop trigger if exists on_auth_user_admin on auth.users;

-- Run this once if the admin account already existed before this schema:
update public.profiles
set is_admin = true
where lower(email) = 'vivekganwal2004@gmail.com';

-- Safe upgrade statements for projects that ran an earlier version of this file.
alter table public.orders add column if not exists razorpay_order_id text unique;
alter table public.cart_items alter column item_id type text using item_id::text;

-- Upgrade an already-created project from the earlier, unsafe public profile policy.
drop policy if exists "Public profiles are viewable by everyone" on public.profiles;
drop policy if exists "Users can view own profile" on public.profiles;
create policy "Users can view own profile"
  on public.profiles for select using (auth.uid() = id);

-- Update updated_at
create or replace function public.handle_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger set_updated_at before update on public.profiles
  for each row execute procedure public.handle_updated_at();
create trigger set_updated_at before update on public.adventures
  for each row execute procedure public.handle_updated_at();
create trigger set_updated_at before update on public.destinations
  for each row execute procedure public.handle_updated_at();
create trigger set_updated_at before update on public.packages
  for each row execute procedure public.handle_updated_at();
create trigger set_updated_at before update on public.cart_items
  for each row execute procedure public.handle_updated_at();
create trigger set_updated_at before update on public.orders
  for each row execute procedure public.handle_updated_at();
