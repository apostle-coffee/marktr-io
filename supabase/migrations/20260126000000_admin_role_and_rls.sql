alter table public.profiles
  add column if not exists role text not null default 'user';

update public.profiles
  set role = 'user'
  where role is null;

alter table public.profiles enable row level security;

create policy "Users can view own profile"
  on public.profiles
  for select
  using (auth.uid() = id);

create policy "Users can update own profile"
  on public.profiles
  for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

drop policy if exists "Users can insert own stripe_subscription"
  on public.stripe_subscriptions;
drop policy if exists "Users can update own stripe_subscription"
  on public.stripe_subscriptions;
drop policy if exists "Users can delete own stripe_subscription"
  on public.stripe_subscriptions;
