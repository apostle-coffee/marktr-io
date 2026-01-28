-- Add name column to onboarding_leads for storing onboarding-entered names
alter table public.onboarding_leads
  add column if not exists name text;

create index if not exists onboarding_leads_name_idx
  on public.onboarding_leads (name);
