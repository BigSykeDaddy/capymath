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
    const [phase, setPhase] = useState<'idle' | 'exiting' | 'entering'>('idle')
    const [finished, setFinished] = useState(false)

    const card = cards[index]
    const answer = card.a * card.b

    // manage slide‑out / slide‑in timing
    useEffect(() => {
        let t: NodeJS.Timeout
        if (phase === 'exiting') {
            t = setTimeout(() => {
                if (index < cards.length - 1) {
                    setIndex(i => i + 1)
                    setShowAnswer(false)
                    setPhase('entering')
                } else {
                    setFinished(true)
                }
            }, 300)
        }
        if (phase === 'entering') {
            t = setTimeout(() => setPhase('idle'), 300)
        }
        return () => clearTimeout(t)
    }, [phase, index, cards.length])

    const handleClick = () => {
        if (finished) return
        if (!showAnswer) {
            setShowAnswer(true)
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
                    className="w-56 px-6 py-3 bg-[var(--color-accent)] text-white rounded-lg text-lg"
                >
                    🔁 Repeat Flashcards
                </button>
                <button
                    onClick={() => onComplete?.()}
                    className="w-56 px-6 py-3 bg-green-600 text-white rounded-lg text-lg"
                >
                    ✅ I&apos;m Ready!
                </button>
            </div>
        )
    }

    // slide transforms
    const slideClass = phase === 'exiting'
        ? 'translate-x-[-100%] opacity-0 transition-all duration-300 ease-in'
        : phase === 'entering'
            ? 'translate-x-[100%] opacity-0 transition-all duration-300 ease-out'
            : 'translate-x-0 opacity-100'

    return (
        <div className="flex flex-col items-center">
            <button
                onClick={handleClick}
                className="relative w-72 h-96 outline-none select-none"
            >
                {/* outer: handles slide */}
                <div
                    className={`${slideClass} absolute inset-0 transition-all`}
                >
                    {/* inner: handles flip */}
                    <div className={`relative w-full h-full transition-transform duration-200 [transform-style:preserve-3d] ${showAnswer ? '[transform:rotateY(180deg)]' : ''}`}>

                        {/* front face */}
                        <div className="absolute inset-0 bg-white rounded-xl border-4 border-[var(--color-accent)] shadow-lg flex items-center justify-center [backface-visibility:hidden]">
                            <div className="grid grid-cols-[auto_auto] tabular-nums px-6 py-6">
                                <div className="col-start-2 text-8xl font-extrabold text-[var(--color-accent)] text-right">{card.a}</div>
                                <div className="col-start-1 row-start-2 text-8xl font-extrabold text-[var(--color-accent)]">×</div>
                                <div className="col-start-2 row-start-2 text-8xl font-extrabold text-[var(--color-accent)] text-right">{card.b}</div>
                                <div className="col-span-2 w-11/12 border-b-8 border-[var(--color-accent)] mt-2 mx-auto" />
                                <div className="col-start-2 mt-2 text-8xl font-extrabold text-[var(--color-accent)] text-right">&nbsp;</div>
                            </div>
                        </div>

                        {/* back face */}
                        <div className="absolute inset-0 bg-white rounded-xl border-4 border-[var(--color-accent)] shadow-lg flex items-center justify-center [transform:rotateY(180deg)] [backface-visibility:hidden]">
                            <div className="grid grid-cols-[auto_auto] tabular-nums px-6 py-6">
                                <div className="col-start-2 text-8xl font-extrabold text-[var(--color-accent)] text-right">{card.a}</div>
                                <div className="col-start-1 row-start-2 text-8xl font-extrabold text-[var(--color-accent)]">×</div>
                                <div className="col-start-2 row-start-2 text-8xl font-extrabold text-[var(--color-accent)] text-right">{card.b}</div>
                                <div className="col-span-2 w-11/12 border-b-8 border-[var(--color-accent)] mt-2 mx-auto" />
                                <div className="col-start-2 mt-2 text-8xl font-extrabold text-[var(--color-accent)] text-right">{answer}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </button>
            <p className="mt-4 text-lg text-gray-700">Tap to flip, then tap to advance</p>
        </div>
    )
}
