-- Add Stripe checkout session_id to guest_checkouts for reliable post-checkout lookup
alter table public.guest_checkouts
  add column if not exists session_id text;

-- Helpful indexes for fast lookup
create index if not exists guest_checkouts_session_id_idx
  on public.guest_checkouts (session_id);

-- Optional: ensure session_id is unique when present (Stripe session IDs are unique)
do $$
begin
  if not exists (
    select 1 from pg_constraint
    where conname = 'guest_checkouts_session_id_unique'
  ) then
    alter table public.guest_checkouts
      add constraint guest_checkouts_session_id_unique unique (session_id);
  end if;
end $$;
