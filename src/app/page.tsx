'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function LandingPage() {
  const { status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/signin'); // redirect if not logged in
    } else if (status === 'authenticated') {
      router.push('/menu'); // go straight to the main menu
    }
  }, [status, router]);

  return (
    <div className="min-h-screen flex items-center justify-center text-xl text-gray-500">
      Loading...
    </div>
  );
}
