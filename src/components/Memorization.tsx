// src/components/Memorization.tsx
'use client'

import { useState, useRef, useEffect } from 'react'
import Image from 'next/image'
import { logAttempt } from '@/lib/practice'
import { allCombos } from '@/utils/generateQuestions'
import type { Question } from './types'
import BackToMenu from './BackToMenu'
import CapybaraAnimation from './CapybaraAnimation'
import FlashcardCarousel from './FlashcardCarousel'

interface MemorizationProps {
  userId: string
}

type Bubble = { id: number; x: number; y: number; size: number }
type FlashcardItem = { a: number; b: number; front: string; back: string }

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
      ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

export default function Memorization({ userId }: MemorizationProps) {
  // quiz settings
  const [mode, setMode] = useState<'range' | 'upto'>('range')
  const [minTable, setMinTable] = useState(1)
  const [maxTable, setMaxTable] = useState(12)
  const [uptoTable, setUptoTable] = useState(1)

  // flashcard toggle
  const [useFlashcards, setUseFlashcards] = useState(false)
  const [showFlashcards, setShowFlashcards] = useState(false)
  const [flashcards, setFlashcards] = useState<FlashcardItem[]>([])

  const tableOptions = Array.from({ length: 12 }, (_, i) => i + 1)

  // question pool & tracking
  const [pool, setPool] = useState<Question[]>([])
  const wrongSet = useRef<Set<string>>(new Set())
  const allProblemsRef = useRef<
    { question: string; userAnswer: string; correct: boolean; timeMs: number; round: number }[]
  >([])

  const [current, setCurrent] = useState<Question | null>(null)
  const [answer, setAnswer] = useState('')
  const [totalCount, setTotalCount] = useState(0)
  const [correctCount, setCorrectCount] = useState(0)
  const [started, setStarted] = useState(false)
  const [finished, setFinished] = useState(false)

  // capy bubbles
  const [bubbles, setBubbles] = useState<Bubble[]>([])
  const nextBubbleId = useRef(1)
  const inputRef = useRef<HTMLInputElement>(null)

  // focus input on new question
  useEffect(() => {
    if (started && !finished && current && inputRef.current) {
      inputRef.current.focus()
      inputRef.current.select()
    }
  }, [current, started, finished])

  async function saveSessionToDB() {
    if (!allProblemsRef.current.length) return
    try {
      const res = await fetch('/api/sessions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mode: 'memorization', problems: allProblemsRef.current }),
      })
      if (!res.ok) console.error('❌ Failed to save session:', await res.text())
    } catch (err) {
      console.error('❌ Error posting session:', err)
    }
  }

  function nextQuestion(srcPool?: Question[]) {
    const src = srcPool ?? pool
    if (!src.length) {
      if (!wrongSet.current.size) {
        saveSessionToDB()
        setFinished(true)
        setCurrent(null)
      } else {
        const retryQs = shuffle(
          Array.from(wrongSet.current).map((key) => {
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

  function start() {
    wrongSet.current.clear()
    allProblemsRef.current = []

    const combos: Question[] =
      mode === 'range'
        ? shuffle(allCombos(minTable, maxTable))
        : shuffle(
          Array.from({ length: uptoTable }, (_, i) => i + 1).flatMap((t) =>
            Array.from({ length: 12 }, (_, m) => ({ table: t, multiplier: m + 1 }))
          )
        )

    if (useFlashcards) {
      const cards = combos.map((q) => ({
        a: q.table,
        b: q.multiplier,
        front: `${q.table} × ${q.multiplier}`,
        back: `${q.table} × ${q.multiplier} = ${q.table * q.multiplier}`,
      }))
      setFlashcards(cards)
      setShowFlashcards(true)
      return
    }

    setPool(combos)
    setTotalCount(combos.length)
    setCorrectCount(0)
    setFinished(false)
    setStarted(true)
    nextQuestion(combos)
  }

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
    setBubbles((bs) => [...bs, ...newB])
    newB.forEach((b) =>
      setTimeout(() => setBubbles((bs) => bs.filter((x) => x.id !== b.id)), 600)
    )
  }

  async function handleSubmit(evt?: React.MouseEvent | React.KeyboardEvent) {
    if (!current) return
    const guess = Number(answer)
    const correctAnswer = current.table * current.multiplier
    const isCorrect = guess === correctAnswer
    const problem = `${current.table}×${current.multiplier}`

    try {
      await logAttempt({ userId, problem, correct: isCorrect, timeMs: 0, mode: 'memorization' })
    } catch {
      // ignore logging errors
    }

    allProblemsRef.current.push({ question: problem, userAnswer: answer, correct: isCorrect, timeMs: 0, round: 1 })

    if (isCorrect) {
      setCorrectCount((c) => c + 1)
      if (evt && 'clientX' in evt && 'clientY' in evt) maybeSpawnBubbles(evt.clientX, evt.clientY)
    } else {
      wrongSet.current.add(problem)
    }

    nextQuestion()
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') handleSubmit()
  }

  function handleFlashComplete() {
    setShowFlashcards(false)
    setStarted(true)
    const newPool = flashcards.map((fc) => ({ table: fc.a, multiplier: fc.b }))
    setPool(newPool)
    setTotalCount(newPool.length)
    setCorrectCount(0)
    nextQuestion(newPool)
  }

  if (showFlashcards) {
    return (
      <div className="pt-10">
        <FlashcardCarousel cards={flashcards} onComplete={handleFlashComplete} />
      </div>
    )
  }

  return (
    <div className="w-full max-w-full relative min-h-screen flex flex-col items-center px-4 sm:px-8 pt-8 bg-[var(--color-bg)] text-[var(--color-fg)]">
      <CapybaraAnimation progress={totalCount > 0 ? correctCount / totalCount : 0} finished={finished} />

      {bubbles.map((b) => (
        <div
          key={b.id}
          style={{ position: 'absolute', left: b.x - b.size / 2, top: b.y - b.size / 2, width: b.size, height: b.size, pointerEvents: 'none' }}
        >
          <Image src="/images/capy-face.png" alt="✨" width={b.size} height={b.size} className="animate-capy-pop" />
        </div>
      ))}

      <h2 className="text-4xl font-bold my-6">Memorization Mode</h2>

      {!started && (
        <div className="flex flex-col items-center space-y-4">
          <div className="flex items-center space-x-6">
            <label className="flex items-center space-x-1">
              <input type="radio" checked={mode === 'range'} onChange={() => setMode('range')} />
              <span>Range</span>
            </label>
            <label className="flex items-center space-x-1">
              <input type="radio" checked={mode === 'upto'} onChange={() => setMode('upto')} />
              <span>Up to</span>
            </label>
          </div>

          {mode === 'range' ? (
            <div className="flex items-center space-x-2">
              <label>From:</label>
              <select value={minTable} onChange={(e) => setMinTable(Number(e.target.value))} className="p-2 border rounded">
                {tableOptions.map((n) => <option key={n} value={n}>{n}</option>)}
              </select>
              <label>To:</label>
              <select value={maxTable} onChange={(e) => setMaxTable(Number(e.target.value))} className="p-2 border rounded">
                {tableOptions.filter((n) => n >= minTable).map((n) => <option key={n} value={n}>{n}</option>)}
              </select>
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <label>Up to:</label>
              <select value={uptoTable} onChange={(e) => setUptoTable(Number(e.target.value))} className="p-2 border rounded">
                {tableOptions.map((n) => <option key={n} value={n}>{n}</option>)}
              </select>
            </div>
          )}

          <label className="flex items-center space-x-2">
            <input type="checkbox" checked={useFlashcards} onChange={(e) => setUseFlashcards(e.target.checked)} />
            <span>Include Flashcards Before Quiz</span>
          </label>

          <button onClick={start} className="px-6 py-3 bg-[var(--color-accent)] text-white rounded-lg hover:bg-[var(--color-accent)]/80">
            {mode === 'range' ? `Begin (${minTable}–${maxTable})` : `Begin (1–${uptoTable})`}
          </button>
        </div>
      )}

      {started && !finished && current && (
        <>
          <p className="mb-4 text-2xl">{current.table} × {current.multiplier} = ?</p>
          <div className="flex items-center space-x-2 mb-6">
            <input
              ref={inputRef}
              type="text"
              inputMode="numeric"
              className="w-24 p-2 border rounded text-center"
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <button onClick={handleSubmit} className="px-6 py-2 bg-[var(--color-accent)] text-white rounded-lg hover:bg-[var(--color-accent)]/80">
              Submit
            </button>
          </div>
        </>
      )}

      {started && finished && (
        <div className="text-center space-y-4">
          <p className="text-2xl">All done! 🎉</p>
          <p>You mastered every single problem in this range.</p>
          <div className="flex justify-center space-x-4">
            <button onClick={start} className="px-6 py-3 bg-[var(--color-accent)] text-white rounded-lg hover:bg-[var(--color-accent)]/80">Try Again</button>
            <button onClick={() => setStarted(false)} className="px-6 py-3 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400/80">New Range</button>
          </div>
        </div>
      )}

      <BackToMenu />
    </div>
  )
}