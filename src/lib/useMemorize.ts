// src/lib/useMemorize.ts
'use client'

import { useEffect, useState, useRef } from 'react'

export type Problem = { table: number; multiplier: number }

export function useMemorize(
  minTable: number = 1,
  maxTable: number = 12,
  durationSec: number = 60
) {
  // current problem & answer text
  const [problem, setProblem] = useState<Problem | null>(null)
  const [answer, setAnswer]   = useState<string>('')

  // score & timing
  const [correctCount, setCorrectCount] = useState(0)
  const [totalCount, setTotalCount]     = useState(0)
  const [timeLeft, setTimeLeft]         = useState(durationSec)
  const [finished, setFinished]         = useState(false)

  // map "table-multiplier" → how many times missed
  const [wrongMap, setWrongMap]         = useState<Map<string, number>>(new Map())

  // persisted high-scores keyed by "min-max"
  const [highscores, setHighscores]     = useState<Record<string, number>>({})

  // interval ref so we can clear on unmount/restart
  const intervalRef = useRef<number | null>(null)

  // load highscores once
  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('memHighscores') || '{}') 
    setHighscores(stored)
  }, [])

  // pick a random problem, weighting missed ones heavier
  function pickProblem(): Problem {
    const pool: Problem[] = []
    for (let t = minTable; t <= maxTable; t++) {
      for (let m = minTable; m <= maxTable; m++) {
        pool.push({ table: t, multiplier: m })
      }
    }
    // compute weights = 1 + (times missed)
    const weights = pool.map(p => {
      const key = `${p.table}-${p.multiplier}`
      return (wrongMap.get(key) || 0) + 1
    })
    // roulette‐wheel selection
    const totalW = weights.reduce((a, b) => a + b, 0)
    let r = Math.random() * totalW
    for (let i = 0; i < pool.length; i++) {
      if (r < weights[i]) return pool[i]
      r -= weights[i]
    }
    return pool[0]
  }

  // start or restart the session
  const start = () => {
    setCorrectCount(0)
    setTotalCount(0)
    setWrongMap(new Map())
    setFinished(false)
    setAnswer('')
    setTimeLeft(durationSec)

    if (intervalRef.current !== null) {
      clearInterval(intervalRef.current)
    }
    setProblem(pickProblem())

    intervalRef.current = window.setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          if (intervalRef.current !== null) {
            clearInterval(intervalRef.current)
          }
          setFinished(true)
          return 0
        }
        return t - 1
      })
    }, 1000)
  }

  // cleanup on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current !== null) {
        clearInterval(intervalRef.current)
      }
    }
  }, [])

  // submit current answer and queue next
  const submit = () => {
    if (!problem) return

    const guess      = Number(answer)
    const correctAns = problem.table * problem.multiplier
    const isRight    = guess === correctAns

    setTotalCount(c => c + 1)
    if (isRight) {
      setCorrectCount(c => c + 1)
    } else {
      const key = `${problem.table}-${problem.multiplier}`
      setWrongMap(m => {
        const copy = new Map(m)
        copy.set(key, (copy.get(key) || 0) + 1)
        return copy
      })
    }

    setAnswer('')
    setProblem(pickProblem())
  }

  // simple retry
  const retry = () => start()

  // record high-score when finished
  useEffect(() => {
    if (!finished) return
    const key  = `${minTable}-${maxTable}`
    const prev = highscores[key] || 0
    if (correctCount > prev) {
      const upd = { ...highscores, [key]: correctCount }
      setHighscores(upd)
      localStorage.setItem('memHighscores', JSON.stringify(upd))
    }
  }, [finished, correctCount, highscores, minTable, maxTable])

  return {
    start,
    problem,
    answer,
    setAnswer,
    submit,
    score: { correct: correctCount, total: totalCount },
    timeLeft,
    finished,
    highscores,
    wrongMap,
    retry,
  }
}
