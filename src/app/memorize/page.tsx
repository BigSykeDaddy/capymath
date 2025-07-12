'use client'

import Memorization from '@/components/Memorization'
import { useSession } from 'next-auth/react'

export default function MemorizePage() {
  const { data: session, status } = useSession()

  // You can adjust this logic as needed later
  const userId = session?.user?.id || 'guest'

  // If you're using session loading UI, handle that too:
  if (status === 'loading') return <p>Loading...</p>

  return <Memorization userId={userId} />
}
