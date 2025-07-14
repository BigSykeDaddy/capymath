'use client';

import { getCsrfToken } from 'next-auth/react';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function SignIn() {
  const [csrfToken, setCsrfToken] = useState<string | undefined>(undefined);
  const [showPassword, setShowPassword] = useState(false);
  const params = useSearchParams();

  useEffect(() => {
    getCsrfToken().then((token) => setCsrfToken(token || undefined));
  }, []);

  const error = params.get('error');

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-4 text-center">Sign In to CapyMath</h1>
        {error && (
          <p className="text-red-500 text-sm mb-2 text-center">
            {decodeURIComponent(error)}
          </p>
        )}
        <form method="post" action="/api/auth/callback/credentials" className="space-y-4">
          <input name="csrfToken" type="hidden" defaultValue={csrfToken} />
          <input name="callbackUrl" type="hidden" value="/menu" /> {/* 👈 added this */}

          <input
            name="email"
            type="email"
            placeholder="Email"
            className="w-full px-4 py-2 border rounded"
            required
          />

          <div className="relative">
            <input
              name="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="Password"
              className="w-full px-4 py-2 border rounded"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-sm text-blue-600"
            >
              {showPassword ? 'Hide' : 'Show'}
            </button>
          </div>

          <button
            type="submit"
            className="w-full bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-semibold py-2 px-4 rounded transition"
          >
            Sign In
          </button>
        </form>

        <p className="mt-4 text-center text-sm">
          Don&apos;t have an account?{' '}
          <Link href="/signup" className="text-blue-600 hover:underline">
            Sign up here
          </Link>
        </p>
        <p className="mt-2 text-center text-sm">
          Didn&apos;t receive a verification email?{' '}
          <Link href="/resend" className="text-blue-600 hover:underline">
            Click here to resend it
          </Link>
        </p>
      </div>
    </div>
  );
}
