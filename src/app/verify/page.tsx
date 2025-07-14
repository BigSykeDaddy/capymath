'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';

export default function VerifyPage() {
  const params = useSearchParams();
  const token = params.get('token');
  const router = useRouter();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');

  useEffect(() => {
    if (!token) {
      setStatus('error');
      return;
    }

    const verify = async () => {
      try {
        const res = await fetch('/api/auth/verify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token }),
        });

        if (res.ok) {
          setStatus('success');
          setTimeout(() => router.push('/signin'), 2000);
        } else {
          throw new Error();
        }
      } catch {
        setStatus('error');
      }
    };

    verify();
  }, [token, router]);

  return (
    <div className="text-center mt-10 text-lg">
      {status === 'loading' && <p>Verifying your email...</p>}
      {status === 'success' && <p className="text-green-600">Email verified! Redirecting...</p>}
      {status === 'error' && (
        <p className="text-red-600">
          Verification failed. This token may be invalid or expired.
        </p>
      )}
    </div>
  );
}
