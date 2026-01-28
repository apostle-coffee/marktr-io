import { createClient } from "@supabase/supabase-js";

const supabaseUrl = (import.meta.env.VITE_SUPABASE_URL || "").trim();
const supabaseAnonKey = (import.meta.env.VITE_SUPABASE_ANON_KEY || "").trim();

if (import.meta.env.DEV) {
  console.log("🔎 Supabase env check:", {
    VITE_SUPABASE_URL: supabaseUrl,
    anonKeyLength: supabaseAnonKey ? supabaseAnonKey.length : 0,
  });
}

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("❌ Supabase environment variables missing!", {
    VITE_SUPABASE_URL: supabaseUrl || "missing",
    VITE_SUPABASE_ANON_KEY_length: supabaseAnonKey ? supabaseAnonKey.length : "missing",
  });
  throw new Error(
    "Supabase env missing. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in .env.local, then restart `npm run dev`."
  );
}

// Common misconfig: pointing Supabase URL at the Vite dev server
if (supabaseUrl.includes("localhost:5173") || supabaseUrl.includes("http://localhost")) {
  throw new Error(
    `Supabase URL looks wrong: "${supabaseUrl}". It must be your https://xxxx.supabase.co URL, not the Vite dev server.`
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

