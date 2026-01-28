-- Harden RLS for onboarding_leads: no anon insert/select; updates only by owner; Edge Function uses service role.

alter table public.onboarding_leads enable row level security;

-- Drop permissive insert/update policies if they exist
do $$
begin
  if exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'onboarding_leads'
      and policyname = 'Allow insert for leads'
  ) then
    drop policy "Allow insert for leads" on public.onboarding_leads;
  end if;

  if exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'onboarding_leads'
      and policyname = 'Allow update for own lead'
  ) then
    drop policy "Allow update for own lead" on public.onboarding_leads;
  end if;
end$$;

-- Optional: keep INSERT closed (Edge Function uses service role and bypasses RLS)
-- If you ever need auth inserts, create an explicit policy for authenticated users only.

-- Strict UPDATE: only owner (user_id = auth.uid())
do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'onboarding_leads'
      and policyname = 'Allow update when owner'
  ) then
    create policy "Allow update when owner"
      on public.onboarding_leads
      for update
      to authenticated
      using (user_id = auth.uid())
      with check (user_id = auth.uid());
  end if;
end$$;

-- No SELECT policy: leads remain non-readable by clients.
