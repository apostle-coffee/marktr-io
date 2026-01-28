/**
 * Guest-generated ICP storage (local-only).
 * Used to show ICP Results for users who haven't created an account yet.
 * On first login/signup, we flush these into Supabase and then clear.
 */

const STORAGE_KEY = "icpgen:lastGenerated:v1";

export type GeneratedICP = Record<string, any>;

export interface LastGeneratedPayload {
  createdAt: number;
  icps: GeneratedICP[];
}

export function setLastGenerated(icps: GeneratedICP[]) {
  try {
    const payload: LastGeneratedPayload = {
      createdAt: Date.now(),
      icps: Array.isArray(icps) ? icps : [],
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  } catch (err) {
    console.warn("generatedStore: failed to write localStorage", err);
  }
}

export function getLastGenerated(): LastGeneratedPayload | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as LastGeneratedPayload;
    if (!parsed || !Array.isArray(parsed.icps)) return null;
    return parsed;
  } catch (err) {
    console.warn("generatedStore: failed to read localStorage", err);
    return null;
  }
}

export function clearLastGenerated() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (err) {
    console.warn("generatedStore: failed to clear localStorage", err);
  }
}

/**
 * One-shot consume: get + clear. Use this when flushing to Supabase.
 */
export function consumeLastGenerated(): LastGeneratedPayload | null {
  const payload = getLastGenerated();
  if (payload) clearLastGenerated();
  return payload;
}

