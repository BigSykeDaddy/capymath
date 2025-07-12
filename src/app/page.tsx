// src/app/page.tsx
'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import HomePage from '@/components/HomePage'
import { AuthButton } from '@/components/ui/AuthButton'

export default function LandingPage() {
  const { status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/signin') // 👈 redirect users who aren't signed in
    }
  }, [status, router])

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center text-xl text-gray-500">
        Loading...
      </div>
    )
  }

  return (
    <>
      {/* Optional: floating Sign Out button in top-right */}
      <div className="absolute top-4 right-4 z-50">
        <AuthButton />
      </div>
      <HomePage />
    </>
  )
}
