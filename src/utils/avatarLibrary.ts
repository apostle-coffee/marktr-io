export type AvatarGender = "female" | "male" | "non_binary";

// Lock these in – they also match Meta value rules nicely.
export type AvatarAgeRange = "18-24" | "25-34" | "35-44" | "45-54" | "55-64" | "65+";

// IMPORTANT:
// This is the only “config” you need to maintain as your avatar library grows.
// Set how many images exist PER folder (gender + age_range).
//
// Start simple: set to 12 (or whatever you currently have) and increase later.
export const AVATAR_COUNT: Record<AvatarGender, Record<AvatarAgeRange, number>> = {
  female: { "18-24": 12, "25-34": 12, "35-44": 12, "45-54": 12, "55-64": 12, "65+": 12 },
  male: { "18-24": 12, "25-34": 12, "35-44": 12, "45-54": 12, "55-64": 12, "65+": 12 },
  non_binary: { "18-24": 12, "25-34": 12, "35-44": 12, "45-54": 12, "55-64": 12, "65+": 12 },
};

function pad3(n: number) {
  return String(n).padStart(3, "0");
}

// avatar_key is stored as a RELATIVE path under /images/avatars
// e.g. "female/25-34/female_25-34_001.png"
export function buildAvatarKey(gender: AvatarGender, ageRange: AvatarAgeRange, idx1Based: number) {
  const file = `${gender}_${ageRange}_${pad3(idx1Based)}.png`;
  return `${gender}/${ageRange}/${file}`;
}

export function avatarUrlFromKey(avatarKey?: string | null) {
  if (!avatarKey) return "/images/profiles/ld1.png"; // existing fallback
  // stored as "female/25-34/..." so resolve under /images/avatars
  return `/images/avatars/${avatarKey}`;
}

// Convenience alias used by components
export function getAvatarSrc(avatarKey?: string | null) {
  return avatarUrlFromKey(avatarKey);
}

export function getAvatarFolderInfo(
  genderRaw?: string | null,
  ageRangeRaw?: string | null
): { gender: AvatarGender; ageRange: AvatarAgeRange } {
  const gender: AvatarGender =
    genderRaw === "male" || genderRaw === "non_binary" ? (genderRaw as AvatarGender) : "female";

  const allowed: AvatarAgeRange[] = ["18-24", "25-34", "35-44", "45-54", "55-64", "65+"];
  const ageRange: AvatarAgeRange = allowed.includes(ageRangeRaw as any) ? (ageRangeRaw as AvatarAgeRange) : "25-34";

  return { gender, ageRange };
}

export function pickNAlternatives(
  gender: AvatarGender,
  ageRange: AvatarAgeRange,
  n: number,
  excludeKey?: string | null
) {
  const max = AVATAR_COUNT[gender][ageRange] || 1;
  const out = new Set<string>();
  let guard = 0;
  while (out.size < n && guard < 200) {
    guard++;
    const idx = Math.floor(Math.random() * max) + 1; // 1..max
    const key = buildAvatarKey(gender, ageRange, idx);
    if (excludeKey && key === excludeKey) continue;
    out.add(key);
  }
  return Array.from(out);
}
