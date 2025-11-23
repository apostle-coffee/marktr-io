import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: string | Date): string {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

export function isSubscriptionActive(status: string): boolean {
  return status === 'active' || status === 'trialing'
}

export function canAccessFeature(
  tier: string,
  feature: 'ai' | 'export' | 'collaborate' | 'unlimited'
): boolean {
  if (tier === 'enterprise') return true
  if (tier === 'pro') {
    return feature !== 'collaborate' || feature !== 'unlimited'
  }
  return feature === 'ai' // Free tier only has basic AI
}

