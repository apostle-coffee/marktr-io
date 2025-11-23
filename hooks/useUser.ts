import { useState, useEffect } from 'react'
import { User, UserProfile } from '@/types/user'

export function useUser() {
  const [user, setUser] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Placeholder - will be implemented with Supabase auth
    // For now, return mock data
    const mockUser: UserProfile = {
      id: '1',
      email: 'user@example.com',
      name: 'John Doe',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      subscriptionTier: 'free',
      subscriptionStatus: 'active',
    }
    setUser(mockUser)
    setLoading(false)
  }, [])

  return { user, loading }
}

