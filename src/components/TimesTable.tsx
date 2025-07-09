// src/components/TimesTable.tsx
'use client'

import { useState } from 'react'

// (Optionally, centralize this in src/components/types.ts)
type Problem = { a: number; b: number }

export default function TimesTable() {
  const cells: Problem[] = Array.from({ length: 12 }, (_, i) => i + 1)
    .flatMap(a => Array.from({ length: 12 }, (_, j) => ({ a, b: j + 1 })))

  return (
    <div
      className="grid grid-cols-12 gap-2 mx-auto my-8"
      style={{ width: 'clamp(400px, 90vw, 900px)' }}
    >
      {cells.map(({ a, b }) => {
        const label = `${a}×${b}`
        const answer = a * b
        const [show, setShow] = useState(label)
        const reveal = () => {
          setShow(String(answer))
          setTimeout(() => setShow(label), 800)
        }
        return (
          <div
            key={`${a}-${b}`}
            onClick={reveal}
            className="w-full aspect-square bg-white border border-gray-300 rounded-lg flex items-center justify-center select-none text-[var(--color-fg)] font-medium text-sm sm:text-base transition hover:bg-[var(--color-primary)]/30 active:scale-95"
          >
            {show}
          </div>
        )
      })}
    </div>
  )
}
