// src/components/HomePage.tsx
'use client'

import { useRouter } from 'next/navigation'

export default function HomePage() {
  const router = useRouter()
  const modes = [
    { label: 'Multiplication Table', path: '/timestable' },
    { label: 'Skip-Counting',        path: '/skip'      },
    { label: 'Quiz Mode',            path: '/quiz'      },
    { label: 'Memorization',         path: '/memorize'  },
  ]

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[var(--color-bg)] text-[var(--color-fg)] font-[var(--font-sans)]">
      <h1 className="text-5xl font-bold text-[var(--color-primary)] mb-8">CapyMath</h1>
      <div className="space-y-4">
        {modes.map(mode => (
          <button
            key={mode.path}
            onClick={() => router.push(mode.path)}
            className="block w-64 text-center px-6 py-3 bg-[var(--color-accent)] text-white rounded-lg hover:bg-[var(--color-accent)]/80 transition"
          >
            {mode.label}
          </button>
        ))}
      </div>
    </div>
  )
}
