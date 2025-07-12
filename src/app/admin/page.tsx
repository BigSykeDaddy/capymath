// app/admin/page.tsx
import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '@/lib/auth'
import AdminClientPage from './AdminClientPage'

export default async function AdminPage() {
  const session = await getServerSession(authOptions)

  if (!session || session.user.role !== 'parent') {
    redirect('/api/auth/signin')
  }

  return <AdminClientPage session={session} />
}
