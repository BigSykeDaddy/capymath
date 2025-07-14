// src/components/SplashScreen.tsx
'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { AuthButton } from '@/components/ui/AuthButton';
import { motion, AnimatePresence } from 'framer-motion';

function AnimatedTitle({ text }: { text: string }) {
  return (
    <h1 className="text-6xl font-bold text-[var(--color-primary)] mb-10 text-center">
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
  );
}

export default function SplashScreen({ onSelect }: { onSelect: (path: string) => void }) {
  const [step, setStep] = useState<'title' | 'capy' | 'bubble' | 'menu'>('title');
  const { data: session } = useSession();

  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];
    timers.push(setTimeout(() => setStep('capy'), 500));
    timers.push(setTimeout(() => setStep('bubble'), 800));
    timers.push(setTimeout(() => setStep('menu'), 801));
    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-start pt-40 sm:pt-24 bg-[var(--color-bg)] px-4 overflow-x-hidden">
      {/* Top‐left nav (unchanged) */}
      <header className="fixed top-4 left-4 z-50 flex items-center space-x-4">
        <Link href="/menu" aria-label="Go to main menu">
          <Image
            src="/images/capy-face.png"
            alt="Capybara"
            width={48}
            height={48}
            className="cursor-pointer"
          />
        </Link>
        <AuthButton />
        {session?.user?.role === 'parent' && (
          <Link href="/admin">
            <button className="ml-2 px-4 py-1 rounded-full bg-[var(--color-accent)] text-white text-sm hover:bg-[#F65A46] transition shadow">
              CapyParent
            </button>
          </Link>
        )}
      </header>

      {/* Title (matches menu) */}
      <AnimatedTitle text="CapyMath" />

      {/* Capy + Speech Bubble */}
      {step !== 'title' && (
        <div className="relative mb-10 w-1/2 max-w-[120px] sm:w-[180px] sm:max-w-none animate-scale-in">
          <Image
            src="/capy-loading.png"
            alt="Capy Cartoon"
            width={180}
            height={150}
            priority
            className="w-full h-auto"
          />

          {/* bubble floats on top */}
          <AnimatePresence>
            {(step === 'bubble' || step === 'menu') && (
              <motion.div
                className="absolute z-20 bg-white px-3 py-1.5 sm:px-4 sm:py-2 rounded-full shadow-lg animate-fade-in text-[var(--color-fg)] whitespace-nowrap text-sm sm:text-base -top-10 left-[30%] sm:-top-12 sm:-left-[180px]"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
              >
                <p className="text-lg text-[var(--color-fg)] whitespace-nowrap">
                  Hi Arya! Let’s do some Math!
                </p>
                <div
                  className="w-4 h-4 bg-white absolute rotate-[35deg]"
                  style={{ bottom: '-3px', right: '13px' }}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      {/* Buttons (same as menu) */}
      {step === 'menu' && (
        <div className="mt-7 flex flex-col gap-4 items-center w-full max-w-[600px] mx-auto animate-fade-in z-10">
          {[
            { label: 'Multiplication Table', path: '/timestable' },
            { label: 'Skip-Counting', path: '/skip' },
            { label: 'Quiz Mode', path: '/quiz' },
            { label: 'Memorization', path: '/memorize' },
          ].map(({ label, path }) => (
            <button
              key={path}
              onClick={() => onSelect(path)}
              className="
                mx-auto max-w-xs
                px-9 py-4 text-base
                sm:px-9 sm:py-5 sm:text-lg
                rounded-full bg-[var(--color-accent)]
                hover:bg-[#F65A46] text-white font-semibold tracking-wide
                transition shadow-md
              "
            >
              {label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
