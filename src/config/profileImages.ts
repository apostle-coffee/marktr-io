/**
 * Profile Images Library
 *
 * This file exports all available profile images for use in:
 * - ICP generation
 * - Testimonials
 * - Other profile displays
 *
 * Add new images to public/images/avatars/ and update this file.
 */

export const profileImages = {
  // Legacy profile images (used in testimonials / hero content)
  ld1: "/images/profiles/ld1.png",
  charlotte: "/images/profiles/charlotte.png",
  adrian: "/images/profiles/adrian.png",
  belinda: "/images/profiles/belinda.png",
} as const;

const avatarLibrary = [
  "/images/avatars/female/18-24/female_18-24_001.png",
  "/images/avatars/female/18-24/female_18-24_002.png",
  "/images/avatars/female/18-24/female_18-24_003.png",
  "/images/avatars/female/18-24/female_18-24_004.png",
  "/images/avatars/female/18-24/female_18-24_005.png",
  "/images/avatars/female/18-24/female_18-24_006.png",
  "/images/avatars/female/18-24/female_18-24_007.png",
  "/images/avatars/female/18-24/female_18-24_008.png",
  "/images/avatars/female/18-24/female_18-24_009.png",
  "/images/avatars/female/25-34/female_25-34_001.png",
  "/images/avatars/female/25-34/female_25-34_002.png",
  "/images/avatars/female/25-34/female_25-34_003.png",
  "/images/avatars/female/25-34/female_25-34_004.png",
  "/images/avatars/female/25-34/female_25-34_005.png",
  "/images/avatars/female/25-34/female_25-34_006.png",
  "/images/avatars/female/25-34/female_25-34_007.png",
  "/images/avatars/female/25-34/female_25-34_008.png",
  "/images/avatars/female/25-34/female_25-34_009.png",
  "/images/avatars/female/25-34/female_25-34_010.png",
  "/images/avatars/female/25-34/female_25-34_011.png",
  "/images/avatars/female/25-34/female_25-34_012.png",
  "/images/avatars/female/25-34/female_25-34_013.png",
  "/images/avatars/female/25-34/female_25-34_014.png",
  "/images/avatars/female/35-44/female_35-44_002.png",
  "/images/avatars/female/35-44/female_35-44_003.png",
  "/images/avatars/female/35-44/female_35-44_004.png",
  "/images/avatars/female/45-54/female_45-54_001.png",
  "/images/avatars/female/45-54/female_45-54_002.png",
  "/images/avatars/female/55-64/female_55-64_001.png",
  "/images/avatars/female/55-64/female_55-64_002.png",
  "/images/avatars/female/65+/female_64+_001.png",
  "/images/avatars/female/65+/female_64+_002.png",
] as const;

const fallbackProfileImage = "/images/profiles/ld1.png";

/**
 * Get a random profile image from the library
 */
export function getRandomProfileImage(): string {
  const images = avatarLibrary.length
    ? avatarLibrary
    : Object.values(profileImages);
  if (images.length === 0) {
    return fallbackProfileImage;
  }
  return images[Math.floor(Math.random() * images.length)];
}

/**
 * Get a specific profile image by key
 */
export function getProfileImage(key: keyof typeof profileImages): string {
  return profileImages[key] || getRandomProfileImage();
}

/**
 * Get all available profile images as an array
 */
export function getAllProfileImages(): string[] {
  return avatarLibrary.length ? [...avatarLibrary] : Object.values(profileImages);
}

/**
 * Get the number of available profile images
 */
export function getProfileImageCount(): number {
  return avatarLibrary.length
    ? avatarLibrary.length
    : Object.keys(profileImages).length;
}
