// src/components/SkipCounting.tsx
'use client'

import { useState } from 'react'

export default function SkipCounting() {
  // 1) State for the “step” you count by
  const [step, setStep] = useState(2)

  // 2) Generate the first 12 multiples of that step
  const values = Array.from({ length: 12 }, (_, i) => (i + 1) * step)

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 bg-[var(--color-bg)] text-[var(--color-fg)]">
      <h2 className="text-4xl font-bold mb-6">Skip-Count by {step}</h2>

      <label className="mb-4">
        Choose your step:
        <select
          className="ml-2 p-2 border rounded"
          value={step}
          onChange={e => setStep(Number(e.target.value))}
        >
          {Array.from({ length: 12 }, (_, i) => i + 1).map(n => (
            <option key={n} value={n}>{n}</option>
          ))}
        </select>
      </label>

      <ul className="grid grid-cols-4 gap-4 w-full max-w-md">
        {values.map((n, i) => (
          <li
            key={i}
            className="p-4 bg-white rounded shadow text-center text-lg"
          >
            {n}
          </li>
        ))}
      </ul>
    </div>
  )
}
