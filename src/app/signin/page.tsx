// src/app/signin/page.tsx
"use client";

import { getCsrfToken } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function SignIn() {
  const [csrfToken, setCsrfToken] = useState<string | undefined>(undefined);
  const params = useSearchParams();

  useEffect(() => {
    getCsrfToken().then((token) => setCsrfToken(token || undefined));
  }, []);

  const error = params.get("error");

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
          <input
            name="email"
            type="email"
            placeholder="Email"
            className="w-full px-4 py-2 border rounded"
            required
          />
          <input
            name="password"
            type="password"
            placeholder="Password"
            className="w-full px-4 py-2 border rounded"
            required
          />
          <button
            type="submit"
            className="w-full bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-semibold py-2 px-4 rounded transition"
          >
            Sign In
          </button>
        </form>
        <p className="mt-4 text-center text-sm">
          Don't have an account?{' '}
          <Link href="/signup" className="text-blue-600 hover:underline">
            Sign up here
          </Link>
        </p>
      </div>
    </div>
  );
}
