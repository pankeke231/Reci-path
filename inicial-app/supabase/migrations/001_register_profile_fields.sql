-- Migración: campos ampliados de registro en profiles
-- Ejecutar si ya creaste la BD con el schema anterior

alter table public.profiles
  add column if not exists document_id text,
  add column if not exists first_names text not null default '',
  add column if not exists last_names text not null default '',
  add column if not exists address text;

create unique index if not exists profiles_document_id_key
  on public.profiles (document_id)
  where document_id is not null;

-- Actualizar trigger de registro
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
