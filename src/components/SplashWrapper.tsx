// src/components/SplashWrapper.tsx
'use client'

import { useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import SplashScreen from './SplashScreen'

export default function SplashWrapper({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const pathname = usePathname()

  const handleSelect = (path: string) => {
    router.push(path)
    setLoading(false)
  }

  // A reusable “safe container”
  const SafeArea: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <div className="w-full overflow-x-hidden">
      <div className="mx-auto max-w-[600px] px-4 sm:px-0">
        {children}
      </div>
    </div>
  )

  if (loading && pathname === '/') {
    return (
      <SafeArea>
        <SplashScreen onSelect={handleSelect} />
      </SafeArea>
    )
  }

  return <SafeArea>{children}</SafeArea>
}
