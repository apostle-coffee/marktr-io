create table if not exists public.guest_checkouts (
  guest_ref text primary key,
  email text,
  stripe_customer_id text,
  stripe_subscription_id text,
  price_id text,
  status text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.guest_checkouts enable row level security;
