// src/components/Memorization.tsx
'use client'

import { useState, useRef } from 'react'
import Image from 'next/image'
import { useMemorize } from '@/lib/useMemorize'

type Bubble = { id: number; x: number; y: number; size: number }

export default function Memorization() {
  // table‐range selectors
  const [minTable, setMinTable] = useState(1)
  const [maxTable, setMaxTable] = useState(12)
  const tableOptions = Array.from({ length: 12 }, (_, i) => i + 1)

  // memorize hook
  const {
    start,
    problem,
    answer,
    setAnswer,
    submit,
    score,
    timeLeft,
    finished,
    highscores,
    wrongMap,
    retry,
  } = useMemorize(minTable, maxTable)

  const rangeKey = `${minTable}-${maxTable}`
  const bestScore = highscores[rangeKey] ?? 0

  // bubble state
  const [bubbles, setBubbles] = useState<Bubble[]>([])
  const nextBubbleId = useRef(1)

  // ref for the answer input
  const inputRef = useRef<HTMLInputElement>(null)

  // spawn bubbles around a point
  function maybeSpawnBubbles(x: number, y: number) {
    const count = 3 + Math.floor(Math.random() * 3)  // 3–5 bubbles
    const newB: Bubble[] = []

    for (let i = 0; i < count; i++) {
      const id = nextBubbleId.current++
      const size = 24 + Math.random() * 16            // 24px–40px
      const ox = (Math.random() - 0.5) * 40
      const oy = (Math.random() - 0.5) * 40
      newB.push({ id, x: x + ox, y: y + oy, size })
    }

    setBubbles(b => [...b, ...newB])
    newB.forEach(b => {
      setTimeout(() => setBubbles(bc => bc.filter(x => x.id !== b.id)), 600)
    })
  }

  // handle click on Submit button
  function handleButtonSubmit(e: React.MouseEvent<HTMLButtonElement>) {
    if (!problem) return
    const guess = Number(answer)
    const correctAns = problem.table * problem.multiplier
    if (guess === correctAns) {
      maybeSpawnBubbles(e.clientX, e.clientY)
    }
    submit()
  }

  // handle Enter key on input
  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key !== 'Enter' || !problem) return
    const guess = Number(answer)
    const correctAns = problem.table * problem.multiplier
    if (guess === correctAns && inputRef.current) {
      const rect = inputRef.current.getBoundingClientRect()
      maybeSpawnBubbles(
        rect.left + rect.width / 2,
        rect.top + rect.height / 2
      )
    }
    submit()
  }

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center p-8 bg-[var(--color-bg)] text-[var(--color-fg)]">
      {/* bubbles */}
      {bubbles.map(b => (
        <div
          key={b.id}
          style={{
            position: 'absolute',
            left: b.x - b.size / 2,
            top:  b.y - b.size / 2,
            width:  b.size,
            height: b.size,
            pointerEvents: 'none',
          }}
        >
          <Image
            src="/images/capy-face.png"
            alt="✨"
            width={b.size}
            height={b.size}
            className="animate-capy-pop"
          />
        </div>
      ))}

      <h2 className="text-4xl font-bold mb-6">Memorization Mode</h2>

      {/* BEFORE START */}
      {!problem && !finished && (
        <div className="flex flex-col items-center space-y-4">
          <div>
            <label className="mr-2">From:</label>
            <select
              value={minTable}
              onChange={e => {
                const v = Number(e.target.value)
                setMinTable(v)
                if (v > maxTable) setMaxTable(v)
              }}
              className="p-2 border rounded mr-4"
            >
              {tableOptions.map(n => (
                <option key={n} value={n}>{n}</option>
              ))}
            </select>

            <label className="mr-2">To:</label>
            <select
              value={maxTable}
              onChange={e => setMaxTable(Number(e.target.value))}
              className="p-2 border rounded"
            >
              {tableOptions.filter(n => n >= minTable).map(n => (
                <option key={n} value={n}>{n}</option>
              ))}
            </select>
          </div>

          <button
            onClick={start}
            className="px-6 py-3 bg-[var(--color-accent)] text-white rounded-lg hover:bg-[var(--color-accent)]/80"
          >
            Begin ({minTable}–{maxTable})
          </button>
        </div>
      )}

      {/* DURING SESSION */}
      {problem && !finished && (
        <>
          <p className="mb-4 text-lg">
            Time Left: <span className="font-semibold">{timeLeft}s</span>
          </p>
          <p className="mb-4 text-2xl">
            {problem.table} × {problem.multiplier} = ?
          </p>

          <div className="flex items-center space-x-2 mb-6">
            <input
              ref={inputRef}
              type="number"
              value={answer}
              onChange={e => setAnswer(e.target.value)}
              onKeyDown={handleKeyDown}
              className="w-24 p-2 border rounded text-center"
            />
            <button
              onClick={handleButtonSubmit}
              className="px-6 py-2 bg-[var(--color-accent)] text-white rounded-lg hover:bg-[var(--color-accent)]/80"
            >
              Submit
            </button>
          </div>

          <p className="text-lg">
            Score:{' '}
            <span className="font-semibold">{score.correct}</span>/
            <span className="font-semibold">{score.total}</span>
          </p>
        </>
      )}

      {/* FINISHED */}
      {finished && (
        <div className="text-center space-y-4">
          <p className="text-xl">Time&apos;s up!</p>
          <p className="text-lg">
            Final Score:{' '}
            <span className="font-semibold">{score.correct}</span>/
            <span className="font-semibold">{score.total}</span>
          </p>
          <p className="text-lg">
            Best Score ({rangeKey}):{' '}
            <span className="font-semibold">{bestScore}</span>
          </p>
          <div className="text-left">
            <p className="font-semibold mb-1">Missed Problems:</p>
            {Array.from(wrongMap.entries()).map(([key, count]) => (
              <div key={key}>
                {key.replace('-', '×')} — missed {count}
              </div>
            ))}
            {wrongMap.size === 0 && <div>None! 🎉</div>}
          </div>
          <button
            onClick={retry}
            className="px-6 py-3 bg-[var(--color-accent)] text-white rounded-lg hover:bg-[var(--color-accent)]/80"
          >
            Try Again
          </button>
        </div>
      )}
    </div>
  )
}
