# Profile Images Library

This directory contains profile images used throughout the application for:
- **ICP Generation**: Profile images assigned to generated Ideal Customer Profiles
- **Testimonials**: Profile images for testimonial displays
- **Other Profile Displays**: Any other places where profile images are needed

## Adding Profile Images

### Step 1: Upload Your PNG Images
1. Add your PNG profile images to this directory: `public/images/profiles/`
2. Recommended image specs:
   - **Format**: PNG (supports transparency)
   - **Size**: 128x128px minimum (larger is fine, will be scaled)
   - **Aspect Ratio**: Square (1:1)
   - **File Size**: Optimize for web (keep under 200KB per image)

### Step 2: Name Your Files
Use descriptive names or a consistent pattern:
- **By Name**: `charlotte.png`, `adrian.png`, `belinda.png`
- **By Number**: `profile-01.png`, `profile-02.png`, `profile-03.png`
- **Mixed**: Any combination that makes sense for your use case

### Step 3: Register in the Config File
After uploading, update `src/config/profileImages.ts`:

```typescript
export const profileImages = {
  // Existing images
  charlotte: "/images/profiles/charlotte.png",
  adrian: "/images/profiles/adrian.png",
  belinda: "/images/profiles/belinda.png",
  
  // Add your new images here:
  profile01: "/images/profiles/profile-01.png",
  profile02: "/images/profiles/profile-02.png",
  // etc.
} as const;
```

## Using Profile Images in Code

### Get a Specific Profile Image
```typescript
import { getProfileImage } from "@/config/profileImages";

// Use a specific profile by key
const image = getProfileImage("charlotte");
```

### Get a Random Profile Image
```typescript
import { getRandomProfileImage } from "@/config/profileImages";

// Use for ICP generation - randomly assign a profile
const randomImage = getRandomProfileImage();
```

### Get All Available Images
```typescript
import { getAllProfileImages } from "@/config/profileImages";

// Get array of all profile image URLs
const allImages = getAllProfileImages();
```

## Example: Using in ICP Generation

When generating an ICP, you can randomly assign a profile image:

```typescript
import { getRandomProfileImage } from "@/config/profileImages";

const newICP = {
  name: "Sarah",
  avatar: getRandomProfileImage(), // Randomly assigned profile image
  // ... other ICP properties
};
```

## Current Profile Images

The following profile images are currently registered:
- `charlotte` - Used in testimonials and intro message
- `adrian` - Used in testimonials
- `belinda` - Used in testimonials

Add more as needed following the steps above!

