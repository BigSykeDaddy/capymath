'use client'

import Memorization from '@/components/Memorization'
import { useSession } from 'next-auth/react'

export default function MemorizePage() {
  const { data: session, status } = useSession()

  if (status === 'loading') return <p>Loading...</p>

  const userId = session?.user?.id || 'guest'

  return <Memorization userId={userId} />
}
