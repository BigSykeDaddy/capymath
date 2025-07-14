'use client';

import Link from 'next/link';

export default function MenuPage() {
    return (
        <main className="min-h-screen bg-[#f2f2f2] flex flex-col items-center justify-center px-4 py-12">
            <h1 className="text-5xl font-bold text-[#1c1c1c] mb-8 tracking-wide">CapyMath</h1>

            <div className="w-full max-w-xs flex flex-col gap-4">
                <Link href="/timestable">
                    <button className="bg-capy-orange text-white text-lg font-medium py-3 rounded-2xl shadow-md hover:opacity-90 transition">
                        Multiplication Table
                    </button>
                </Link>

                <Link href="/skip-counting">
                    <button className="bg-capy-orange text-white text-lg font-medium py-3 rounded-2xl shadow-md hover:opacity-90 transition">
                        Skip-Counting
                    </button>
                </Link>

                <Link href="/quiz-mode">
                    <button className="bg-capy-orange text-white text-lg font-medium py-3 rounded-2xl shadow-md hover:opacity-90 transition">
                        Quiz Mode
                    </button>
                </Link>

                <Link href="/memorization">
                    <button className="bg-capy-orange text-white text-lg font-medium py-3 rounded-2xl shadow-md hover:opacity-90 transition">
                        Memorization
                    </button>
                </Link>
            </div>
        </main>
    );
}
