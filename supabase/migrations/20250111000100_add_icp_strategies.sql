create table if not exists public.icp_strategies (
  id uuid primary key default gen_random_uuid(),
  icp_id uuid not null references public.icps(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  goal text not null,
  channel text,
  offer_type text,
  tone text,
  strategy jsonb not null,
  prompt_version text not null,
  model text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create unique index if not exists icp_strategies_icp_id_key on public.icp_strategies (icp_id);

alter table public.icp_strategies enable row level security;

create policy "icp_strategies_select_own"
  on public.icp_strategies
  for select
  using (auth.uid() = user_id);

create policy "icp_strategies_insert_own"
  on public.icp_strategies
  for insert
  with check (auth.uid() = user_id);

create policy "icp_strategies_update_own"
  on public.icp_strategies
  for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "icp_strategies_delete_own"
  on public.icp_strategies
  for delete
  using (auth.uid() = user_id);
