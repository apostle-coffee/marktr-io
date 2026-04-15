create table if not exists public.beta_invites (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  access_code_hash text not null,
  status text not null default 'active',
  expires_at timestamptz null,
  max_uses integer null,
  uses_count integer not null default 0,
  redeemed_at timestamptz null,
  granted_by text null,
  notes text null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create unique index if not exists beta_invites_email_hash_unique
  on public.beta_invites (lower(email), access_code_hash);

create index if not exists beta_invites_email_idx
  on public.beta_invites (lower(email));

alter table public.beta_invites enable row level security;

-- No client-side access. Reads/writes are via service-role Edge Functions only.
