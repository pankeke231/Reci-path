-- S.E.A — Esquema inicial PostgreSQL (Supabase)
-- Ejecutar en: SQL Editor → New query → Run

-- Extensiones
create extension if not exists "uuid-ossp";

-- Perfiles (extiende auth.users)
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text not null,
  document_id text unique,
  first_names text not null default '',
  last_names text not null default '',
  full_name text not null default '',
  role text not null default 'citizen'
    check (role in ('citizen', 'collector', 'admin')),
  address text,
  phone text,
  account_status text not null default 'active'
    check (account_status in ('active', 'pending')),
  avatar_url text,
  latitude double precision,
  longitude double precision,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Tipos de residuo
create table if not exists public.waste_types (
  id text primary key,
  name text not null,
  code text not null unique,
  description text,
  icon text,
  recyclable boolean not null default true,
  created_at timestamptz not null default now()
);

-- Pedidos de recolección
create table if not exists public.orders (
  id uuid primary key default uuid_generate_v4(),
  citizen_id uuid not null references public.profiles (id) on delete cascade,
  collector_id uuid references public.profiles (id) on delete set null,
  route_id uuid,
  waste_type_id text not null references public.waste_types (id),
  status text not null default 'pending'
    check (status in ('pending', 'assigned', 'in_route', 'collected', 'cancelled')),
  quantity_kg numeric(10, 2) not null check (quantity_kg > 0),
  notes text,
  latitude double precision not null,
  longitude double precision not null,
  address text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Rutas de recolección
create table if not exists public.routes (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  collector_id uuid not null references public.profiles (id) on delete cascade,
  status text not null default 'planned'
    check (status in ('planned', 'active', 'completed', 'cancelled')),
  scheduled_date date,
  path_geojson jsonb,
  estimated_distance_km numeric(10, 2),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.orders
  add constraint orders_route_id_fkey
  foreign key (route_id) references public.routes (id) on delete set null;

-- Relación ruta ↔ pedidos
create table if not exists public.route_orders (
  route_id uuid not null references public.routes (id) on delete cascade,
  order_id uuid not null references public.orders (id) on delete cascade,
  sequence_index int not null default 0,
  primary key (route_id, order_id)
);

-- Trigger: perfil automático al registrarse
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (
    id,
    email,
    document_id,
    first_names,
    last_names,
    full_name,
    role,
    address,
    phone
  )
  values (
    new.id,
    new.email,
    nullif(new.raw_user_meta_data->>'document_id', ''),
    coalesce(new.raw_user_meta_data->>'first_names', ''),
    coalesce(new.raw_user_meta_data->>'last_names', ''),
    coalesce(new.raw_user_meta_data->>'full_name', ''),
    coalesce(new.raw_user_meta_data->>'role', 'citizen'),
    nullif(new.raw_user_meta_data->>'address', ''),
    nullif(new.raw_user_meta_data->>'phone', '')
  );
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Datos semilla: tipos de residuo
insert into public.waste_types (id, name, code, recyclable) values
  ('plastic', 'Plástico', 'plastic', true),
  ('paper', 'Papel y cartón', 'paper', true),
  ('glass', 'Vidrio', 'glass', true),
  ('metal', 'Metal', 'metal', true),
  ('organic', 'Orgánico', 'organic', false),
  ('general', 'Residuos mixtos', 'general', false)
on conflict (id) do nothing;

-- RLS
alter table public.profiles enable row level security;
alter table public.orders enable row level security;
alter table public.routes enable row level security;
alter table public.waste_types enable row level security;
alter table public.route_orders enable row level security;

-- Función helper admin
create or replace function public.is_admin()
returns boolean
language sql
security definer
stable
set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  );
$$;

-- Perfiles
create policy "profiles_select_own" on public.profiles
  for select to authenticated
  using (public.is_admin() or auth.uid() = id);

create policy "profiles_update_own" on public.profiles
  for update to authenticated
  using (public.is_admin() or auth.uid() = id)
  with check (public.is_admin() or auth.uid() = id);

create policy "profiles_insert_own" on public.profiles
  for insert to authenticated
  with check (public.is_admin() or auth.uid() = id);

-- Waste types: lectura pública autenticada
create policy "waste_types_select" on public.waste_types
  for select to authenticated using (true);

-- Pedidos: ciudadano CRUD propios; recolector lee asignados; admin todo
create policy "orders_citizen_insert" on public.orders
  for insert to authenticated
  with check (auth.uid() = citizen_id);

create policy "orders_citizen_select" on public.orders
  for select to authenticated
  using (
    auth.uid() = citizen_id
    or auth.uid() = collector_id
    or exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.role = 'admin'
    )
  );

create policy "orders_citizen_update" on public.orders
  for update to authenticated
  using (
    auth.uid() = citizen_id
    or auth.uid() = collector_id
    or public.is_admin()
  );

create policy "orders_admin_update" on public.orders
  for update to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- Rutas: recolector ve las suyas; admin todas
create policy "routes_collector_select" on public.routes
  for select to authenticated
  using (
    auth.uid() = collector_id
    or exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.role = 'admin'
    )
  );

-- Índices
create index if not exists idx_orders_citizen on public.orders (citizen_id);
create index if not exists idx_orders_collector on public.orders (collector_id);
create index if not exists idx_orders_status on public.orders (status);
create index if not exists idx_routes_collector on public.routes (collector_id);
