import { createClient } from '@supabase/supabase-js'

// NOTE: This file is unused and kept only for reference. Do not import from here; use src/config/supabase.ts instead.
// ✅ Updated to use Vite environment variables (NOT Next.js vars)
// Using type assertion since this file is outside src/ and may not have Vite types
const supabaseUrl = (import.meta as any).env?.VITE_SUPABASE_URL || ''
const supabaseAnonKey = (import.meta as any).env?.VITE_SUPABASE_ANON_KEY || ''

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Server-side client for API routes
export const createServerClient = () => {
  return createClient(
    (import.meta as any).env?.VITE_SUPABASE_URL || '',
    (import.meta as any).env?.VITE_SUPABASE_ANON_KEY || ''
  )
}
