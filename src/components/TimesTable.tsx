// src/components/TimesTable.tsx
'use client'

import React, { useState } from 'react'

type CellProps = { a: number; b: number }

function Cell({ a, b }: CellProps) {
  const label = `${a}×${b}`
  const answer = a * b
  const [show, setShow] = useState(label)

  const reveal = () => {
    setShow(String(answer))
    setTimeout(() => setShow(label), 800)
  }

  // if show is not the original label, we're in "revealed" state
  const isRevealed = show !== label

  return (
    <div
      onClick={reveal}
      className={`
        w-full aspect-square
        flex items-center justify-center
        select-none rounded-lg border transition
        hover:bg-[var(--color-primary)]/30 active:scale-95
        ${isRevealed 
          ? 'bg-green-50 border-green-200' 
          : 'bg-white border-gray-300'}
      `}
    >
      <span
        className={`
          text-sm sm:text-base
          ${isRevealed 
            ? 'text-green-600 font-bold' 
            : 'text-[var(--color-fg)] font-medium'}
        `}
      >
        {show}
      </span>
    </div>
  )
}

export default function TimesTable() {
  // generate all 12×12 problems
  const cells = Array.from({ length: 12 }, (_, i) => i + 1)
    .flatMap(a => Array.from({ length: 12 }, (_, j) => ({ a, b: j + 1 })))

  return (
    <div
      className="grid grid-cols-12 gap-2 mx-auto my-8"
      style={{ width: 'clamp(400px, 90vw, 900px)' }}
    >
      {cells.map(({ a, b }) => (
        <Cell key={`${a}-${b}`} a={a} b={b} />
      ))}
    </div>
  )
}
