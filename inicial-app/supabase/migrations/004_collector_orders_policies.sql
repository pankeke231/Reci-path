-- Permisos recolector: ver pedidos pendientes y asignarse / completar

create or replace function public.is_collector()
returns boolean
language sql
security definer
stable
set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'collector'
  );
$$;

drop policy if exists "orders_collector_select_pending" on public.orders;
create policy "orders_collector_select_pending" on public.orders
  for select to authenticated
  using (
    public.is_collector()
    and (
      collector_id = auth.uid()
      or (status = 'pending' and collector_id is null)
    )
  );

drop policy if exists "orders_collector_update" on public.orders;
create policy "orders_collector_update" on public.orders
  for update to authenticated
  using (
    public.is_collector()
    and (
      collector_id = auth.uid()
      or (status = 'pending' and collector_id is null)
    )
  )
  with check (collector_id = auth.uid());

-- Recolector puede leer perfiles de ciudadanos (detalle de solicitud)
drop policy if exists "profiles_collector_select_citizens" on public.profiles;
create policy "profiles_collector_select_citizens" on public.profiles
  for select to authenticated
  using (
    public.is_collector() and (role = 'citizen' or auth.uid() = id)
  );
