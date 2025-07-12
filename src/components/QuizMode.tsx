'use client'

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import { logAttempt } from '@/lib/practice'

interface QuizModeProps {
  userId: string
}

type Question = { a: number; b: number; answer: number }
type Bubble   = { id: number; x: number; y: number; size: number }

export default function QuizMode({ userId }: QuizModeProps) {
  const [question, setQuestion] = useState<Question>({ a: 0, b: 0, answer: 0 })
  const [options, setOptions] = useState<number[]>([])
  const [correctCount, setCorrect] = useState(0)
  const [totalCount, setTotal] = useState(0)
  const [bestPct, setBestPct] = useState(0)

  const [bubbles, setBubbles] = useState<Bubble[]>([])
  const nextBubbleId = useRef(1)

  useEffect(() => {
    const stored = parseInt(localStorage.getItem('bestPct') || '0', 10)
    setBestPct(stored)
    nextQuestion()
  }, [])

  function nextQuestion() {
    const a = Math.ceil(Math.random() * 12)
    const b = Math.ceil(Math.random() * 12)
    const answer = a * b

    const opts = new Set<number>([answer])
    while (opts.size < 4) {
      const ra = Math.ceil(Math.random() * 12)
      const rb = Math.ceil(Math.random() * 12)
      opts.add(ra * rb)
    }

    setQuestion({ a, b, answer })
    setOptions(shuffle(Array.from(opts)))
  }

  function maybeSaveBest(newCorrect: number, newTotal: number) {
    const pct = newTotal ? Math.round((newCorrect / newTotal) * 100) : 0
    if (pct > bestPct) {
      setBestPct(pct)
      localStorage.setItem('bestPct', pct.toString())
    }
  }

  async function handleChoice(choice: number, e: React.MouseEvent<HTMLButtonElement>) {
    const isRight = choice === question.answer
    const newTotal = totalCount + 1
    const newCorrect = isRight ? correctCount + 1 : correctCount

    setTotal(newTotal)
    if (isRight) {
      setCorrect(newCorrect)
      maybeSpawnBubbles(e.clientX, e.clientY)
    }

    maybeSaveBest(newCorrect, newTotal)

    // 🧠 Log attempt to DB if user is logged in
    if (userId) {
      try {
        await logAttempt({
          userId,
          problem: `${question.a}x${question.b}`,
          correct: isRight,
          timeMs: 0, // We’ll wire up timing later
          mode: 'quiz',
        })
      } catch (err) {
        console.error('Failed to log quiz attempt:', err)
      }
    }

    nextQuestion()
  }

  function maybeSpawnBubbles(x: number, y: number) {
    const count = 3 + Math.floor(Math.random() * 4)
    const newBubs: Bubble[] = []

    for (let i = 0; i < count; i++) {
      const id = nextBubbleId.current++
      const size = 24 + Math.random() * 16
      const ox = (Math.random() - 0.5) * 40
      const oy = (Math.random() - 0.5) * 40
      newBubs.push({ id, x: x + ox, y: y + oy, size })
    }

    setBubbles(b => [...b, ...newBubs])

    newBubs.forEach(bub => {
      setTimeout(() => {
        setBubbles(b => b.filter(x => x.id !== bub.id))
      }, 600)
    })
  }

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center bg-[var(--color-bg)] text-[var(--color-fg)] p-8">
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

      <h2 className="text-4xl font-bold mb-6">
        What is {question.a} × {question.b}?
      </h2>

      <div className="grid grid-cols-2 gap-4 mb-6">
        {options.map((opt, i) => (
          <button
            key={i}
            onClick={e => handleChoice(opt, e)}
            className="px-6 py-3 bg-[var(--color-accent)] text-white rounded-lg hover:bg-[var(--color-accent)]/80 transition"
          >
            {opt}
          </button>
        ))}
      </div>

      <p className="text-lg">
        Score: <span className="font-semibold">{correctCount}</span>/
        <span className="font-semibold">{totalCount}</span> — Best:{' '}
        <span className="font-semibold">{bestPct}%</span>
      </p>
    </div>
  )
}

function shuffle<T>(arr: T[]): T[] {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[arr[i], arr[j]] = [arr[j], arr[i]]
  }
  return arr
}
