// src/lib/useQuiz.ts
import { useEffect, useState } from 'react'

export type Problem = { a: number; b: number }
export type QuizState = {
  problem: Problem
  choices: number[]
  score: { correct: number; total: number; bestPct: number }
  submit: (answer: number) => void
  reset: () => void
}

export function useQuiz(rangeMin = 1, rangeMax = 12): QuizState {
  // score tracking
  const [correct, setCorrect] = useState(0)
  const [total, setTotal]   = useState(0)
  const [bestPct, setBest]  = useState(() => {
    const stored = parseInt(localStorage.getItem('bestPct') || '0')
    return isNaN(stored) ? 0 : stored
  })

  // current problem & choices
  const [problem, setProblem] = useState<Problem>({ a: 1, b: 1 })
  const [choices, setChoices] = useState<number[]>([])

  // generate a new question
  const next = () => {
    const a = rand(rangeMin, rangeMax)
    const b = rand(rangeMin, rangeMax)
    const correctAns = a * b

    // 1 correct + 3 random decoys
    const opts = new Set<number>([correctAns])
    while (opts.size < 4) {
      opts.add(rand(rangeMin, rangeMax) * rand(rangeMin, rangeMax))
    }

    setProblem({ a, b })
    setChoices(shuffle(Array.from(opts)))
  }

  // call next() on mount
  useEffect(() => { next() }, [])

  // submit handler
  const submit = (answer: number) => {
    const isRight = answer === problem.a * problem.b
    const newTotal   = total + 1
    const newCorrect = correct + (isRight ? 1 : 0)
    setTotal(newTotal)
    setCorrect(newCorrect)

    // update best%
    const pct = Math.round((newCorrect / newTotal) * 100)
    if (pct > bestPct) {
      setBest(pct)
      localStorage.setItem('bestPct', String(pct))
    }

    next()
  }

  const reset = () => {
    setCorrect(0)
    setTotal(0)
    next()
  }

  return {
    problem,
    choices,
    score: { correct, total, bestPct },
    submit,
    reset,
  }
}

// helpers
function rand(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}
function shuffle<T>(arr: T[]) {
  return arr.sort(() => Math.random() - 0.5)
}
