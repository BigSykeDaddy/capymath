// src/components/Memorization.tsx
'use client'

import { useState, useRef, useEffect } from 'react'
import Image from 'next/image'
import type { Question } from './types'
import { allCombos } from '@/utils/generateQuestions'
import CapybaraAnimation from './CapybaraAnimation'

type Bubble = { id: number; x: number; y: number; size: number }

// Fisher–Yates shuffle
function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

export default function Memorization() {
  // ─── 1) Selection mode & table picks ────────────────────
  const [mode, setMode] = useState<'range' | 'upto'>('range')
  const [minTable, setMinTable] = useState(1)
  const [maxTable, setMaxTable] = useState(12)
  const [uptoTable, setUptoTable] = useState(1)
  const tableOptions = Array.from({ length: 12 }, (_, i) => i + 1)

  // ─── 2) Question pool & current question ───────────────
  const [pool, setPool] = useState<Question[]>([])
  const wrongSet = useRef<Set<string>>(new Set())
  const [current, setCurrent] = useState<Question | null>(null)
  const [answer, setAnswer] = useState('')

  // ─── 3) Progress tracking ───────────────────────────────
  const [totalCount, setTotalCount] = useState(0)
  const [correctCount, setCorrectCount] = useState(0)

  // ─── 4) UI state ───────────────────────────────────────
  const [started, setStarted] = useState(false)
  const [finished, setFinished] = useState(false)

  // ─── 5) Bubble confetti ────────────────────────────────
  const [bubbles, setBubbles] = useState<Bubble[]>([])
  const nextBubbleId = useRef(1)
  const inputRef = useRef<HTMLInputElement>(null)

  /** Advance to next question or retry wrong ones */
  function nextQuestion(fromPool?: Question[]) {
    const src = fromPool ?? pool
    if (src.length === 0) {
      if (wrongSet.current.size === 0) {
        setFinished(true)
        setCurrent(null)
      } else {
        const retryQs = shuffle(
          Array.from(wrongSet.current).map(key => {
            const [t, m] = key.split('×').map(Number)
            return { table: t, multiplier: m }
          })
        )
        wrongSet.current.clear()
        setPool(retryQs)
        return nextQuestion(retryQs)
      }
      return
    }
    const [q, ...rest] = src
    setCurrent(q)
    setPool(rest)
    setAnswer('')
  }

  /** Start (or restart) a session */
  function start() {
    wrongSet.current.clear()

    // build our list of {table, multiplier}
    let combos: Question[]
    if (mode === 'range') {
      // tables & multipliers both from minTable…maxTable
      combos = shuffle(allCombos(minTable, maxTable))
    } else {
      // “Up to” mode: tables 1…uptoTable, multipliers 1…12
      const list: Question[] = []
      for (let t = 1; t <= uptoTable; t++) {
        for (let m = 1; m <= 12; m++) {
          list.push({ table: t, multiplier: m })
        }
      }
      combos = shuffle(list)
    }

    setPool(combos)
    setTotalCount(combos.length)
    setCorrectCount(0)
    setFinished(false)
    setStarted(true)
    nextQuestion(combos)
  }

  /** Spawn confetti bubbles on correct */
  function maybeSpawnBubbles(x: number, y: number) {
    const count = 3 + Math.floor(Math.random() * 3)
    const newB: Bubble[] = []
    for (let i = 0; i < count; i++) {
      const id = nextBubbleId.current++
      const size = 24 + Math.random() * 16
      const ox = (Math.random() - 0.5) * 40
      const oy = (Math.random() - 0.5) * 40
      newB.push({ id, x: x + ox, y: y + oy, size })
    }
    setBubbles(bs => [...bs, ...newB])
    newB.forEach(b =>
      setTimeout(() => setBubbles(bs => bs.filter(x => x.id !== b.id)), 600)
    )
  }

  /** Handle answer submission */
  function handleSubmit(evt?: React.MouseEvent) {
    if (!current) return
    const guess = Number(answer)
    const correct = current.table * current.multiplier
    if (guess === correct) {
      setCorrectCount(c => c + 1)
      if (evt) maybeSpawnBubbles(evt.clientX, evt.clientY)
      else if (inputRef.current) {
        const r = inputRef.current.getBoundingClientRect()
        maybeSpawnBubbles(r.left + r.width / 2, r.top + r.height / 2)
      }
    } else {
      wrongSet.current.add(`${current.table}×${current.multiplier}`)
    }
    nextQuestion()
  }
  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') handleSubmit()
  }

  /** Auto‐focus & select whenever a new question appears */
  useEffect(() => {
    if (started && !finished && current && inputRef.current) {
      inputRef.current.focus()
      inputRef.current.select()
    }
  }, [current, started, finished])

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-start p-8 bg-[var(--color-bg)] text-[var(--color-fg)]">
      {/* Progress bar & capy */}
      <CapybaraAnimation
        progress={totalCount > 0 ? correctCount / totalCount : 0}
        finished={finished}
      />

      {/* Confetti bubbles */}
      {bubbles.map(b => (
        <div
          key={b.id}
          style={{
            position: 'absolute',
            left: b.x - b.size / 2,
            top: b.y - b.size / 2,
            width: b.size,
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

      <h2 className="text-4xl font-bold my-6">Memorization Mode</h2>

      {/* Before “Begin” */}
      {!started && (
        <div className="flex flex-col items-center space-y-4">
          {/* mode switch */}
          <div className="flex items-center space-x-6">
            <label className="flex items-center space-x-1">
              <input
                type="radio"
                checked={mode === 'range'}
                onChange={() => setMode('range')}
              />
              <span>Range</span>
            </label>
            <label className="flex items-center space-x-1">
              <input
                type="radio"
                checked={mode === 'upto'}
                onChange={() => setMode('upto')}
              />
              <span>Up to</span>
            </label>
          </div>

          {/* range vs up‐to controls */}
          {mode === 'range' ? (
            <div className="flex items-center space-x-2">
              <label>From:</label>
              <select
                value={minTable}
                onChange={e => {
                  const v = Number(e.target.value)
                  setMinTable(v)
                  if (v > maxTable) setMaxTable(v)
                }}
                className="p-2 border rounded"
              >
                {tableOptions.map(n => (
                  <option key={n} value={n}>
                    {n}
                  </option>
                ))}
              </select>
              <label>To:</label>
              <select
                value={maxTable}
                onChange={e => setMaxTable(Number(e.target.value))}
                className="p-2 border rounded"
              >
                {tableOptions
                  .filter(n => n >= minTable)
                  .map(n => (
                    <option key={n} value={n}>
                      {n}
                    </option>
                  ))}
              </select>
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <label>Up to:</label>
              <select
                value={uptoTable}
                onChange={e => setUptoTable(Number(e.target.value))}
                className="p-2 border rounded"
              >
                {tableOptions.map(n => (
                  <option key={n} value={n}>
                    {n}
                  </option>
                ))}
              </select>
            </div>
          )}

          <button
            onClick={start}
            className="px-6 py-3 bg-[var(--color-accent)] text-white rounded-lg hover:bg-[var(--color-accent)]/80"
          >
            Begin{' '}
            {mode === 'range'
              ? `(${minTable}–${maxTable})`
              : `(1–${uptoTable})`}
          </button>
        </div>
      )}

      {/* Quiz UI */}
      {started && !finished && current && (
        <>
          <p className="mb-4 text-2xl">
            {current.table} × {current.multiplier} = ?
          </p>
          <div className="flex items-center space-x-2 mb-6">
            <input
              ref={inputRef}
              type="text"
              inputMode="numeric"
              className="w-24 p-2 border rounded text-center appearance-none"
              value={answer}
              onChange={e => setAnswer(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <button
              onClick={e => handleSubmit(e)}
              className="px-6 py-2 bg-[var(--color-accent)] text-white rounded-lg hover:bg-[var(--color-accent)]/80"
            >
              Submit
            </button>
          </div>
        </>
      )}

      {/* Finished */}
      {started && finished && (
        <div className="text-center space-y-4">
          <p className="text-2xl">All done! 🎉</p>
          <p>You mastered every single problem in this range.</p>
          <div className="flex justify-center space-x-4">
            <button
              onClick={start}
              className="px-6 py-3 bg-[var(--color-accent)] text-white rounded-lg hover:bg-[var(--color-accent)]/80"
            >
              Try Again
            </button>
            <button
              onClick={() => {
                wrongSet.current.clear()
                setStarted(false)
                setFinished(false)
                setPool([])
                setTotalCount(0)
                setCorrectCount(0)
                setCurrent(null)
              }}
              className="px-6 py-3 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400/80"
            >
              New Range
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
