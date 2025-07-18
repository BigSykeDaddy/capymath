// src/components/FlashcardCarousel.tsx
'use client'
import React, { useState, useEffect } from 'react'

interface Flashcard {
  a: number
  b: number
}
interface FlashcardCarouselProps {
  cards: Flashcard[]
  onComplete?: () => void
}

export default function FlashcardCarousel({ cards, onComplete }: FlashcardCarouselProps) {
  const [index, setIndex] = useState(0)
  const [showAnswer, setShowAnswer] = useState(false)
  const [phase, setPhase] = useState<'idle' | 'flipping' | 'exiting' | 'entering'>('idle')
  const [finished, setFinished] = useState(false)

  const card = cards[index]
  const answer = card.a * card.b

  // manage flip/slide phases
  useEffect(() => {
    let t: NodeJS.Timeout
    if (phase === 'flipping') {
      t = setTimeout(() => setPhase('idle'), 100)
    }
    if (phase === 'exiting') {
      t = setTimeout(() => {
        if (index < cards.length - 1) {
          setIndex(i => i + 1)
          setShowAnswer(false)
          setPhase('entering')
        } else {
          setFinished(true)
        }
      }, 100)
    }
    if (phase === 'entering') {
      t = setTimeout(() => setPhase('idle'), 700)
    }
    return () => clearTimeout(t)
  }, [phase])

  const handleClick = () => {
    if (finished) return
    if (!showAnswer) {
      setShowAnswer(true)
      setPhase('flipping')
    } else {
      setPhase('exiting')
    }
  }

  if (finished) {
    return (
      <div className="flex flex-col items-center space-y-4">
        <button
          onClick={() => {
            setFinished(false)
            setIndex(0)
            setShowAnswer(false)
            setPhase('idle')
          }}
          className="px-6 py-3 bg-[var(--color-accent)] text-white rounded-lg"
        >
          🔁 Repeat Flashcards
        </button>
        <button
          onClick={() => onComplete?.()}
          className="px-6 py-3 bg-green-600 text-white rounded-lg"
        >
          ✅ I'm Ready!
        </button>
      </div>
    )
  }

  // classes for sliding in/out & visibility
  const slideClass = {
    idle: 'translate-x-0 opacity-100',
    flipping: '',
    exiting: '-translate-x-full opacity-0 transition-all duration-500 ease-in',
    entering: 'translate-x-full opacity-0 transition-all duration-600 ease-out',
  }[phase]

  return (
    <div className="flex flex-col items-center">
      <button
        onClick={handleClick}
        className="relative w-72 h-96 perspective-1000"
      >
        <div
          className={`absolute inset-0 bg-white rounded-xl border-4 border-[var(--color-accent)] shadow-lg \
            transition-transform duration-200 [transform-style:preserve-3d] \
            ${phase === 'flipping' ? '[transform:rotateY(180deg)]' : ''} \
            ${phase === 'exiting' || phase === 'entering' ? slideClass : ''}`}
        >
          <div className="grid grid-cols-[auto_auto] tabular-nums px-8 py-6">
            <div className="col-start-2 row-start-1 text-8xl font-extrabold text-[var(--color-accent)] text-right">
              {card.a}
            </div>
            <div className="col-start-1 row-start-2 text-8xl font-extrabold text-[var(--color-accent)]">
              ×
            </div>
            <div className="col-start-2 row-start-2 text-8xl font-extrabold text-[var(--color-accent)] text-right">
              {card.b}
            </div>
            <div className="col-span-2 row-start-3 w-[90%] border-b-8 border-[var(--color-accent)] mt-2 mx-auto" />
            <div className="col-start-2 row-start-4 text-8xl font-extrabold text-[var(--color-accent)] text-right mt-2">
              {showAnswer && phase !== 'flipping' ? answer : '\u00A0'}
            </div>
          </div>
        </div>
      </button>
      <p className="mt-4 text-lg text-gray-700">Click the card to flip</p>
    </div>
  )
}