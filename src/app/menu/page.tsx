'use client';

import Link from 'next/link';
import Image from 'next/image';

export default function MenuPage() {
    return (
        <main className="min-h-screen bg-[var(--color-bg)] flex flex-col items-center justify-center px-4">

            {/* Capy image */}
            <div className="mb-4">
                <Image
                    src="/capy-loading.png"
                    alt="Capy Icon"
                    width={150}
                    height={150}
                    priority
                />
            </div>

            {/* Title */}
            <h1 className="text-5xl font-bold text-[var(--color-primary)] mb-8 text-center">
                CapyMath
            </h1>

            {/* Navigation buttons */}
            <div className="flex flex-col gap-4 items-center">
                {[
                    { label: 'Multiplication Table', path: '/timestable' },
                    { label: 'Skip-Counting', path: '/skip-counting' },
                    { label: 'Quiz Mode', path: '/quiz-mode' },
                    { label: 'Memorization', path: '/memorization' },
                ].map(({ label, path }) => (
                    <Link key={path} href={path}>
                        <button className="px-6 py-2 rounded-lg bg-[var(--color-accent)] hover:bg-[#F65A46] text-white transition shadow">
                            {label}
                        </button>
                    </Link>
                ))}
            </div>
        </main>
    );
}
