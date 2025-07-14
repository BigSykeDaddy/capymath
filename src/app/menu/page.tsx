// src/app/menu/page.tsx
'use client';

import Link from 'next/link';
import Image from 'next/image';

export default function MenuPage() {
    return (
        <main className="min-h-screen bg-[var(--color-bg)] flex flex-col items-center justify-start pt-32 sm:pt-24 px-4 overflow-x-hidden">
            {/* Title (above the capy, matching splash) */}
            <h1 className="text-6xl font-bold text-[var(--color-primary)] mb-8 text-center">
                CapyMath
            </h1>

            {/* Capy image: mobile 50% up to 120px; desktop original 180px */}
            <div className="mb-10 w-1/2 max-w-[120px] sm:w-[180px] sm:max-w-none">
                <Image
                    src="/capy-loading.png"
                    alt="Capy Icon"
                    width={180}
                    height={150}
                    priority
                    className="w-full h-auto"
                />
            </div>

            {/* Navigation buttons */}
            <div className="flex flex-col gap-4 items-center w-full max-w-xs">
                {[
                    { label: 'Multiplication Table', path: '/timestable' },
                    { label: 'Skip-Counting', path: '/skip' },
                    { label: 'Quiz Mode', path: '/quiz' },
                    { label: 'Memorization', path: '/memorize' },
                ].map(({ label, path }) => (
                    <Link key={path} href={path}>
                        <button className="w-full px-6 py-3 text-base sm:px-9 sm:py-5 sm:text-lg rounded-full bg-[var(--color-accent)] hover:bg-[#F65A46] text-white font-semibold tracking-wide transition shadow-md">
                            {label}
                        </button>
                    </Link>
                ))}
            </div>
        </main>
    );
}
