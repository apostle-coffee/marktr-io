export type SubscriptionTier = 'free' | 'pro' | 'enterprise'
export type SubscriptionStatus = 'active' | 'canceled' | 'past_due' | 'trialing'

export interface Subscription {
  id: string
  userId: string
  tier: SubscriptionTier
  status: SubscriptionStatus
  polarSubscriptionId?: string
  currentPeriodStart?: string
  currentPeriodEnd?: string
  cancelAtPeriodEnd?: boolean
  createdAt: string
  updatedAt: string
}

export interface SubscriptionLimits {
  maxICPs: number
  maxCollections: number
  canExport: boolean
  canCollaborate: boolean
  canUseAI: boolean
}

