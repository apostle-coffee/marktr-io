import { useCallback, useEffect, useState } from "react";
import { supabase } from "../config/supabase";
import { useAuth } from "../contexts/AuthContext";

export type Profile = {
  id: string;
  email: string;
  name: string | null;
  subscription_tier: string | null;
  role: string | null;
};

type UseProfileResult = {
  profile: Profile | null;
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
};

export default function useProfile(userId: string | null): UseProfileResult {
  const { user } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const buildFallbackProfile = useCallback((): Profile | null => {
    if (!user || !userId || user.id !== userId) return null;

    const meta = (user.user_metadata || {}) as any;

    const fallback: Profile = {
      id: user.id,
      email: user.email ?? "",
      name: (meta.name as string) || null,
      subscription_tier: "free",
      role: "user",
    };

    console.log("useProfile: using fallback profile from auth user", fallback);
    return fallback;
  }, [user, userId]);

  const fetchProfile = useCallback(async () => {
    if (!userId) {
      console.log("useProfile: no userId, clearing profile");
      setProfile(null);
      setError(null);
      return;
    }

    console.log("useProfile: fetching profile from Supabase", { userId });
    setLoading(true);
    setError(null);

    try {
      const { data, error, status } = await supabase
        .from("profiles")
        .select("id, email, name, subscription_tier, role")
        .eq("id", userId)
        .maybeSingle();

      if (status === 406) {
        console.warn(
          "useProfile: 406 from profiles – returning fallback profile if available",
          { status, error }
        );
        const fallback = buildFallbackProfile();
        setProfile(fallback);
        return;
      }

      if (error) {
        console.warn(
          "useProfile: error fetching profile – returning fallback profile if available",
          error
        );
        const fallback = buildFallbackProfile();
        setProfile(fallback);
        if (!fallback) {
          setError(error as any);
        }
        return;
      }

      if (!data) {
        console.log(
          "useProfile: no profile row – returning fallback profile if available"
        );
        const fallback = buildFallbackProfile();
        setProfile(fallback);
        return;
      }

      const normalized: Profile = {
        id: data.id,
        email: data.email,
        name: data.name ?? null,
        subscription_tier: data.subscription_tier ?? "free",
        role: data.role ?? "user",
      };

      console.log("useProfile: fetched profile", normalized);
      setProfile(normalized);
    } catch (err) {
      console.warn(
        "useProfile: unexpected error – returning fallback profile if available",
        err
      );
      const fallback = buildFallbackProfile();
      setProfile(fallback);
      if (!fallback) {
        setError(err as Error);
      }
    } finally {
      setLoading(false);
      console.log("useProfile: fetch complete");
    }
  }, [userId, buildFallbackProfile]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  return {
    profile,
    loading,
    error,
    refetch: fetchProfile,
  };
}
