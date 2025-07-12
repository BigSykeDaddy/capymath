'use client'

import { useSession, signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'

export default function HomePage() {
  const { data: session, status } = useSession()
  const router = useRouter()

  const modes = [
    { label: 'Multiplication Table', path: '/timestable' },
    { label: 'Skip-Counting',        path: '/skip'      },
    { label: 'Quiz Mode',            path: '/quiz'      },
    { label: 'Memorization',         path: '/memorize'  },
  ]

  const isDisabled = status !== 'authenticated'

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[var(--color-bg)] text-[var(--color-fg)] font-[var(--font-sans)]">
      <h1 className="text-5xl font-bold text-[var(--color-primary)] mb-8">CapyMath</h1>

      {/* Show sign-in button if not logged in */}
      {isDisabled && (
        <button
          onClick={() => signIn()}
          className="mb-6 px-6 py-3 bg-[#FF7F66] hover:bg-[#F65A46] text-white rounded-lg text-lg transition"
        >
          Sign In to Start
        </button>
      )}

      <div className="space-y-4">
        {modes.map(mode => (
          <button
            key={mode.path}
            onClick={() => !isDisabled && router.push(mode.path)}
            disabled={isDisabled}
            className={`block w-64 text-center px-6 py-3 rounded-lg transition ${
              isDisabled
                ? 'bg-gray-400 text-white cursor-not-allowed'
                : 'bg-[var(--color-accent)] text-white hover:bg-[var(--color-accent)]/80'
            }`}
          >
            {mode.label}
          </button>
        ))}
      </div>
    </div>
  )
}
