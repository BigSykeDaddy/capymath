'use client'

import AdminSessionsTable from '@/components/AdminSessionTable'
import { Session } from 'next-auth'

type Props = {
  session: Session
}

export default function AdminClientPage({ session }: Props) {
  return (
    <main className="p-6">
      <p className="text-sm text-gray-500 mb-4">
        Logged in as <strong>{session.user.name}</strong> ({session.user.role})
      </p>
      <h1 className="text-3xl font-bold mb-6">📊 CapyMath Practice Sessions</h1>
      <AdminSessionsTable />
    </main>
  )
}
