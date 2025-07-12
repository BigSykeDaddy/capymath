// src/app/quiz/page.tsx
'use client'

import QuizMode from '@/components/QuizMode'
import { useSession } from 'next-auth/react'

export default function QuizPage() {
  const { data: session } = useSession()
  const userId = session?.user?.id || ''

  return <QuizMode userId={userId} />
}
