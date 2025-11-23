import { useState, useEffect } from 'react'
import { Subscription, SubscriptionLimits } from '@/types/subscription'

export function useSubscription() {
  const [subscription, setSubscription] = useState<Subscription | null>(null)
  const [limits, setLimits] = useState<SubscriptionLimits | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Placeholder - will be implemented with Supabase + Polar
    const mockSubscription: Subscription = {
      id: '1',
      userId: '1',
      tier: 'free',
      status: 'active',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    const mockLimits: SubscriptionLimits = {
      maxICPs: 3,
      maxCollections: 1,
      canExport: false,
      canCollaborate: false,
      canUseAI: true,
    }

    setSubscription(mockSubscription)
    setLimits(mockLimits)
    setLoading(false)
  }, [])

  const isPro = subscription?.tier === 'pro' || subscription?.tier === 'enterprise'
  const isEnterprise = subscription?.tier === 'enterprise'

  return { subscription, limits, loading, isPro, isEnterprise }
}

