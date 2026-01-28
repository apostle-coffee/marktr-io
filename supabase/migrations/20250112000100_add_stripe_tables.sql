create table if not exists public.stripe_customers (
  user_id uuid primary key references auth.users(id) on delete cascade,
  stripe_customer_id text unique not null,
  created_at timestamptz not null default now()
);

alter table public.stripe_customers enable row level security;

create policy "Users can view own stripe_customer"
  on public.stripe_customers
  for select
  using (auth.uid() = user_id);

create policy "Users can insert own stripe_customer"
  on public.stripe_customers
  for insert
  with check (auth.uid() = user_id);

create policy "Users can update own stripe_customer"
  on public.stripe_customers
  for update
  using (auth.uid() = user_id);

create policy "Users can delete own stripe_customer"
  on public.stripe_customers
  for delete
  using (auth.uid() = user_id);

create table if not exists public.stripe_subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  stripe_subscription_id text unique not null,
  stripe_customer_id text not null,
  price_id text,
  status text,
  cancel_at_period_end boolean not null default false,
  current_period_end timestamptz,
  trial_start timestamptz,
  trial_end timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists stripe_subscriptions_user_id_idx
  on public.stripe_subscriptions (user_id);

alter table public.stripe_subscriptions enable row level security;

create policy "Users can view own stripe_subscription"
  on public.stripe_subscriptions
  for select
  using (auth.uid() = user_id);

create policy "Users can insert own stripe_subscription"
  on public.stripe_subscriptions
  for insert
  with check (auth.uid() = user_id);

create policy "Users can update own stripe_subscription"
  on public.stripe_subscriptions
  for update
  using (auth.uid() = user_id);

create policy "Users can delete own stripe_subscription"
  on public.stripe_subscriptions
  for delete
  using (auth.uid() = user_id);
