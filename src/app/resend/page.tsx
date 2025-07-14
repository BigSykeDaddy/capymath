'use client';

import { useState } from 'react';

export default function ResendVerificationPage() {
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('sending');

        const res = await fetch('/api/auth/resend', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email }),
        });

        if (res.ok) {
            setStatus('success');
        } else {
            setStatus('error');
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4">
            <div className="bg-white p-6 rounded shadow-md w-full max-w-md">
                <h1 className="text-2xl font-bold mb-4 text-center">Resend Verification Email</h1>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your email"
                        className="w-full px-4 py-2 border rounded"
                    />
                    <button
                        type="submit"
                        className="w-full bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-semibold py-2 px-4 rounded"
                    >
                        Send Email
                    </button>
                </form>

                {status === 'success' && (
                    <p className="text-green-600 mt-4 text-center">
                        If that email exists and isn’t verified, a new link was sent.
                    </p>
                )}
                {status === 'error' && (
                    <p className="text-red-600 mt-4 text-center">Failed to send email. Try again.</p>
                )}
            </div>
        </div>
    );
}
