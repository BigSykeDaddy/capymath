'use client'

import { useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'

export default function VerifyPage() {
  const params = useSearchParams()
  const token = params.get('token')
  const router = useRouter()

  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')

  useEffect(() => {
    if (!token) {
      setStatus('error')
      return
    }

    fetch('/api/auth/verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token }),
    })
      .then(res => {
        if (res.ok) setStatus('success')
        else throw new Error()
      })
      .catch(() => setStatus('error'))
  }, [token])

  if (status === 'loading') return <p className="text-center mt-10">Verifying...</p>
  if (status === 'success') {
    setTimeout(() => router.push('/signin'), 2000)
    return <p className="text-center mt-10 text-green-600">Email verified! Redirecting...</p>
  }

  return <p className="text-center mt-10 text-red-600">Verification failed or expired.</p>
}
