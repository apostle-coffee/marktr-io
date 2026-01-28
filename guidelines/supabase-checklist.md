Supabase integration checklist (Vite + supabase-js)
---------------------------------------------------

- Client config lives in `src/config/supabase.ts` and must include:
  - `persistSession: true`
  - `autoRefreshToken: true`
  - `detectSessionInUrl: true`
  - Use Vite env vars `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`.

- Auth changes (email/password) must use `supabase.auth.updateUser` with `options.emailRedirectTo` when sending confirmation links. Do not update `profiles` or `user_metadata` for these fields.

- Profiles table:
  - On SIGNED_IN, ensure a profile row exists; if `PGRST116` (row not found), insert one using the auth user id/email.
  - For profile loads, fall back to auth user data if the profile is missing or errors.

- Data fetch patterns (ICPs/collections):
  - Guard fetches with a ref to avoid loops/re-entrancy.
  - Load from in-memory state → local cache → Supabase; add a timeout to network fetches to prevent hanging spinners.
  - Always clear `isLoading` in `finally` blocks.
  - Log fetch start/finish counts to surface silent failures.

- Subscriptions:
  - Fetch from `profiles.subscription_tier`; default to free on error or timeout.
  - Use a single in-flight fetch guard and clear loading even on timeout.

- Auth listener:
  - Handle `SIGNED_IN` (profile existence) and `USER_UPDATED` (email changes) events.
  - Do not overwrite `session.user.email` manually.

- RLS expectations:
  - `icps`/`collections` select/update/delete policies should be `auth.uid() = user_id`.
  - Auth email changes are outside RLS; investigate RLS only if table queries fail.

- When debugging:
  - Check DevTools → Network for `/rest/v1/*` requests (status/response).
  - Check console logs for fetch counts and auth events before assuming a Supabase issue.
