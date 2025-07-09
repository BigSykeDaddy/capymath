// src/components/SplashWrapper.tsx
'use client'

import { useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import SplashScreen from './SplashScreen'

export default function SplashWrapper({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true)
  const router   = useRouter()
  const pathname = usePathname()

  // navigate then hide splash
  const handleSelect = (path: string) => {
    router.push(path)
    setLoading(false)
  }

  if (loading && pathname === '/') {
    return <SplashScreen onSelect={handleSelect} />
  }

  return <>{children}</>
}
