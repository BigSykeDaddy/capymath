'use client';

import Link from 'next/link';

export default function MenuPage() {
    return (
        <main className="flex flex-col items-center justify-center min-h-screen">
            <h1 className="text-4xl font-bold text-capy-green mb-4">CapyMath</h1>

            <Link href="/timestable">
                <button className="bg-capy-orange px-6 py-2 rounded mb-2">Multiplication Table</button>
            </Link>

            <Link href="/skip-counting">
                <button className="bg-capy-orange px-6 py-2 rounded mb-2">Skip-Counting</button>
            </Link>

            <Link href="/quiz-mode">
                <button className="bg-capy-orange px-6 py-2 rounded mb-2">Quiz Mode</button>
            </Link>

            <Link href="/memorization">
                <button className="bg-capy-orange px-6 py-2 rounded">Memorization</button>
            </Link>
        </main>
    );
}
