// src/components/Nav.tsx
'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'

export default function Nav() {
  const path = usePathname()
  // don’t show on the home page
  if (path === '/') return null

  return (
    <header className="fixed top-4 left-4 z-50">
      <Link href="/">
        <Image
          src="/images/capy-face.png"
          alt="Go to main menu"
          width={48}
          height={48}
          className="cursor-pointer animate-capy-pop"
        />
      </Link>
    </header>
  )
}
