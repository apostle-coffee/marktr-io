/**
 * Profile Images Library
 * 
 * This file exports all available profile images for use in:
 * - ICP generation
 * - Testimonials
 * - Other profile displays
 * 
 * Add new images to public/images/profiles/ and update this file.
 */

export const profileImages = {
  // Add your profile images here
  // Format: identifier: "/images/profiles/filename.png"
  
  ld1: "/images/profiles/ld1.png",
  charlotte: "/images/profiles/charlotte.png",
  adrian: "/images/profiles/adrian.png",
  belinda: "/images/profiles/belinda.png",
  
  // Add more as needed:
  // profile01: "/images/profiles/profile-01.png",
  // profile02: "/images/profiles/profile-02.png",
  // etc.
} as const;

/**
 * Get a random profile image from the library
 */
export function getRandomProfileImage(): string {
  const images = Object.values(profileImages);
  if (images.length === 0) {
    // Fallback to a placeholder if no images are available
    return "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=128&h=128&fit=crop";
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
  return Object.values(profileImages);
}

/**
 * Get the number of available profile images
 */
export function getProfileImageCount(): number {
  return Object.keys(profileImages).length;
}

