'use client';

import Link from 'next/link';
import Image from 'next/image';

export default function MenuPage() {
    return (
        <main className="min-h-screen bg-[var(--color-bg)] flex flex-col items-center justify-start pt-24 px-4">

            {/* Capy image */}
            <div className="mb-4">
                <Image
                    src="/capy-loading.png"
                    alt="Capy Icon"
                    width={180}
                    height={150}
                    priority
                />
            </div>

            {/* Title */}
            <h1 className="text-6xl font-bold text-[var(--color-primary)] mb-10 text-center">
                CapyMath
            </h1>

            {/* Navigation buttons */}
            <div className="flex flex-col gap-4 items-center">
                {[
                    { label: 'Multiplication Table', path: '/timestable' },
                    { label: 'Skip-Counting', path: '/skip' },
                    { label: 'Quiz Mode', path: '/quiz' },
                    { label: 'Memorization', path: '/memorize' },
                ].map(({ label, path }) => (
                    <Link key={path} href={path}>
                        <button className="px-9 py-5 rounded-full bg-[var(--color-accent)] hover:bg-[#F65A46] text-white text-lg font-semibold tracking-wide transition shadow-md">
                            {label}
                        </button>
                    </Link>
                ))}
            </div>
        </main>
    );
}
