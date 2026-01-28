-- Track which auth user has claimed a guest checkout
alter table public.guest_checkouts
  add column if not exists linked_user_id uuid references auth.users (id);

create index if not exists guest_checkouts_linked_user_id_idx
  on public.guest_checkouts (linked_user_id);
