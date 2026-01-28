-- Onboarding leads table for email capture (non-blocking, RLS-enabled)
create table if not exists public.onboarding_leads (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  email_normalized text generated always as (lower(trim(email))) stored,
  source text null,
  has_account boolean default false,
  user_id uuid null references auth.users(id) on delete set null,
  converted_at timestamptz null,
  last_seen_at timestamptz null,
  metadata jsonb null,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create unique index if not exists onboarding_leads_email_normalized_idx on public.onboarding_leads(email_normalized);
create index if not exists onboarding_leads_has_account_idx on public.onboarding_leads(has_account);
create index if not exists onboarding_leads_created_at_idx on public.onboarding_leads(created_at);

alter table public.onboarding_leads enable row level security;

-- Allow inserts from anyone (anon/auth) to record a lead
do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'onboarding_leads'
      and policyname = 'Allow insert for leads'
  ) then
    create policy "Allow insert for leads"
      on public.onboarding_leads
      for insert
      with check (true);
  end if;
end$$;

-- Allow authenticated users to update their own lead (by email match or user_id)
do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'onboarding_leads'
      and policyname = 'Allow update for own lead'
  ) then
    create policy "Allow update for own lead"
      on public.onboarding_leads
      for update
      to authenticated
      using (
        (email_normalized = lower(trim(auth.email()::text)))
        or (user_id = auth.uid())
      )
      with check (
        (email_normalized = lower(trim(auth.email()::text)))
        or (user_id = auth.uid())
      );
  end if;
end$$;

-- No SELECT policy provided (leads are not readable by clients).
