/**
 * Avatar resolver for ICP cards.
 * Uses public/ assets:
 *   /public/images/avatars/{gender}/{ageRange}/{filename}.png
 *
 * Backwards compatible:
 * - If avatar_key is missing, caller can fall back to icp.avatar or legacy default artwork.
 */

export type AvatarGender = "male" | "female" | "non_binary";
export type AvatarAgeRange = "18-24" | "25-34" | "35-44" | "45-54" | "55-64" | "65+";

type AvatarInput = {
  avatar_key?: string | null;
  avatar_gender?: string | null;
  avatar_age_range?: string | null;
};

const DEFAULT_AVATAR = "/images/profiles/ld1.png";

function isRootOrHttpPath(v: string) {
  return /^(https?:\/\/|\/)/.test(v);
}

function ensurePng(filename: string) {
  return filename.toLowerCase().endsWith(".png") ? filename : `${filename}.png`;
}

/**
 * Build a public URL to the avatar image using avatar_key + optional gender/ageRange.
 *
 * Supported avatar_key formats:
 * 1) Full path or URL: "/images/avatars/..." or "https://..."
 * 2) Filename only: "female_25-34_001.png" (or without .png)
 * 3) Numeric key: "001" → will be expanded into "{gender}_{ageRange}_001.png"
 */
export function resolveAvatarSrc(
  input: AvatarInput,
  fallback?: string | null
): string {
  const rawKey = (input.avatar_key ?? "").trim();
  const fallbackRaw = (fallback ?? "").trim();

  // If avatar_key is already a URL/path, trust it.
  if (rawKey && isRootOrHttpPath(rawKey)) return rawKey;

  // If we have a key, try to build the standard path.
  if (rawKey) {
    const gender = (input.avatar_gender ?? "female").trim() as string;
    const ageRange = (input.avatar_age_range ?? "25-34").trim() as string;

    // Numeric-only key support: "7" / "007" etc.
    const isNumeric = /^[0-9]+$/.test(rawKey);
    const normalizedKey = isNumeric
      ? `${gender}_${ageRange}_${rawKey.padStart(3, "0")}`
      : rawKey;

    const filename = ensurePng(normalizedKey);
    return `/images/avatars/${gender}/${ageRange}/${filename}`;
  }

  // Backwards compatible: if the old avatar field is a valid path/URL, use it.
  if (fallbackRaw && isRootOrHttpPath(fallbackRaw)) return fallbackRaw;

  // Final fallback: existing default artwork.
  return DEFAULT_AVATAR;
}

