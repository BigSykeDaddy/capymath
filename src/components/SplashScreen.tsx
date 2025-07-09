// src/components/SplashScreen.tsx
'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'

// Letter-by-letter title
function AnimatedTitle({ text }: { text: string }) {
  return (
    <h1 className="flex space-x-1 text-5xl font-bold text-[var(--color-primary)]">
      {text.split('').map((char, i) => (
        <span
          key={i}
          className="inline-block opacity-0 animate-fade-in"
          style={{ animationDelay: `${i * 120}ms` }}
        >
          {char}
        </span>
      ))}
    </h1>
  )
}

export default function SplashScreen({ onSelect }: { onSelect: (path: string) => void }) {
  const [step, setStep] = useState<'title' | 'capy' | 'bubble' | 'menu'>('title')

  useEffect(() => {
    const t: ReturnType<typeof setTimeout>[] = []
    t.push(setTimeout(() => setStep('capy'), 1000))
    t.push(setTimeout(() => setStep('bubble'), 1800))
    t.push(setTimeout(() => setStep('menu'), 2600))
    return () => t.forEach(clearTimeout)
  }, [])

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[var(--color-bg)]">
      {/* Title */}
      <AnimatedTitle text="CapyMath" />

      {/* Capy + bubble container */}
      {step !== 'title' && (
        <div className="relative mt-6">
          {/* Capy image */}
          <div className="animate-scale-in">
            <Image
              src="/capy-loading.png"
              alt="Capy Cartoon"
              width={150}
              height={150}
            />
          </div>

          {/* Speech bubble positioned left of mouth */}
          {(step === 'bubble' || step === 'menu') && (
            <div
              className="absolute bg-white px-4 py-2 rounded-full shadow-lg animate-fade-in z-20"
              style={{
                top: '10%',               // vertically align roughly at mouth
                left: '-280px',           // position to the left of Capy
              }}
            >
              <p className="text-lg text-[var(--color-fg)] whitespace-nowrap">
                Hi Arya! Let’s do some Math!
              </p>
              {/* Triangular tail pointing right-up */}
              <div
                className="w-4 h-4 bg-white absolute"
                style={{
                  bottom: '-3px',          // slightly below bubble
                  right: '13px',           // near corner pointing in
                  transform: 'rotate(35deg)',
                }}
              />
            </div>
          )}
        </div>
      )}

      {/* Menu buttons */}
      {step === 'menu' && (
        <div className="mt-10 space-y-3 animate-fade-in z-10">
          {[
            { label: 'Multiplication Table', path: '/' },
            { label: 'Skip-Counting',      path: '/skip' },
            { label: 'Quiz Mode',          path: '/quiz' },
            { label: 'Memorization',       path: '/memorize' },
          ].map(({ label, path }) => (
            <button
              key={path}
              onClick={() => onSelect(path)}
              className="block mx-auto px-6 py-2 bg-[var(--color-accent)] text-white rounded-lg hover:bg-[var(--color-accent)]/80 transition"
            >
              {label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

/*
Make sure globals.css has fade and scale keyframes and classes:
@keyframes fade-in { from { opacity:0; transform: translateY(10px);} to {opacity:1; transform: translateY(0);} }
.animate-fade-in { animation: fade-in 0.6s ease-out forwards; }
@keyframes scale-in { from { transform: scale(0.6) translateY(-20px); opacity:0;} to {transform: scale(1) translateY(0); opacity:1;} }
.animate-scale-in { animation: scale-in 0.8s cubic-bezier(0.22,1,0.36,1) forwards; }
*/