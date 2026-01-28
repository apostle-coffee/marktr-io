import { supabase } from "../config/supabase";

/**
 * Get Supabase authentication headers for REST API calls
 * Use this for any manual fetch() calls to Supabase REST endpoints
 */
export async function getSupabaseAuthHeaders(): Promise<Record<string, string>> {
  const session = (await supabase.auth.getSession()).data.session;
  const token = session?.access_token ?? "";
  
  const headers: Record<string, string> = {
    apikey: import.meta.env.VITE_SUPABASE_ANON_KEY!,
    "Content-Type": "application/json",
  };
  
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  
  // Log headers in development (without exposing full values)
  if (import.meta.env.DEV) {
    console.log("🔐 Auth Headers:", {
      hasApikey: !!headers.apikey,
      apikeyFirst8: headers.apikey?.slice(0, 8) || "missing",
      hasAuth: !!headers.Authorization,
      tokenFirst10: token?.slice(0, 10) || "missing",
    });
  }
  
  return headers;
}

/**
 * Check if we're actually offline by attempting a simple Supabase query
 * Returns true if we can successfully connect, false if offline
 */
export async function checkOnlineStatus(): Promise<boolean> {
  try {
    // Try a simple query that requires auth to verify connectivity
    const { error } = await supabase
      .from("icps")
      .select("id")
      .limit(1);
    
    // If it's an auth error or network error, we're offline/unauthenticated
    if (error) {
      // 401/403 = auth issue, not necessarily offline
      // Network errors = offline
      const isNetworkError = !error.code || error.code === "ECONNREFUSED" || error.code === "ENOTFOUND";
      if (isNetworkError) {
        console.log("🌐 Network error detected - offline");
        return false;
      }
      // Other errors might be RLS or query issues, but connection is fine
      return true;
    }
    
    return true;
  } catch (err) {
    console.log("🌐 Connection check failed - offline");
    return false;
  }
}

