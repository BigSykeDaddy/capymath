'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { AuthButton } from '@/components/ui/AuthButton';

function AnimatedTitle({ text }: { text: string }) {
  return (
    <h1 className="flex justify-center space-x-1 text-6xl font-bold text-[var(--color-primary)] mb-10">
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
    const t: ReturnType<typeof setTimeout>[] = [];
    t.push(setTimeout(() => setStep('capy'), 500));
    t.push(setTimeout(() => setStep('menu'), 801));
    t.push(setTimeout(() => setStep('bubble'), 800));
    return () => t.forEach(clearTimeout);
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-start pt-24 bg-[var(--color-bg)] px-4">

      {/* Top-left nav with Sign In and CapyParent if logged in */}
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

      {/* Title */}
      <AnimatedTitle text="CapyMath" />

      {/* Capy + bubble container */}
      {step !== 'title' && (
        <div className="relative mt-2">
          <div className="animate-scale-in">
            <Image
              src="/capy-loading.png"
              alt="Capy Cartoon"
              width={180}
              height={150}
              priority
            />
          </div>

          {/* Speech bubble */}
          {(step === 'bubble' || step === 'menu') && (
            <div
              className="absolute bg-white px-4 py-2 rounded-full shadow-lg animate-fade-in z-20"
              style={{
                top: '10%',
                left: '-280px',
              }}
            >
              <p className="text-lg text-[var(--color-fg)] whitespace-nowrap">
                Hi Arya! Let’s do some Math!
              </p>
              <div
                className="w-4 h-4 bg-white absolute"
                style={{
                  bottom: '-3px',
                  right: '13px',
                  transform: 'rotate(35deg)',
                }}
              />
            </div>
          )}
        </div>
      )}

      {/* Menu buttons */}
      {step === 'menu' && (
        <div className="mt-10 flex flex-col gap-4 items-center animate-fade-in z-10">
          {[
            { label: 'Multiplication Table', path: '/timestable' },
            { label: 'Skip-Counting', path: '/skip' },
            { label: 'Quiz Mode', path: '/quiz' },
            { label: 'Memorization', path: '/memorize' },
          ].map(({ label, path }) => (
            <button
              key={path}
              onClick={() => onSelect(path)}
              className="px-9 py-5 rounded-full bg-[var(--color-accent)] hover:bg-[#F65A46] text-white text-lg font-semibold tracking-wide transition shadow-md"
            >
              {label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
