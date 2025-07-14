// src/components/Nav.tsx
'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useSession } from 'next-auth/react'
import { AuthButton } from '@/components/ui/AuthButton'

export default function Nav() {
  const { data: session } = useSession()

  return (
    <header className="fixed top-4 left-4 z-50 flex items-center space-x-4">
      {/* logo */}
      <Link href="/menu" aria-label="Go to main menu">
        <Image
          src="/images/capy-face.png"
          alt="Capybara"
          width={48}
          height={48}
          className="cursor-pointer animate-capy-pop"
        />
      </Link>

      {/* CapyParent link for logged-in parents */}
      {session?.user?.role === 'parent' && (
      <Link
        href="/admin"
        className="px-4 py-2 rounded-lg bg-[#FF7F66] hover:bg-[#F65A46] text-white transition"
      >
        CapyParent
      </Link>
      )}

      {/* sign in / sign out button */}
      <AuthButton />
    </header>
  )
}
