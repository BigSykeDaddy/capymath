import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function POST(req: Request) {
  try {
    const { token } = await req.json()
    if (!token) return NextResponse.json({ error: 'No token provided' }, { status: 400 })

    const dbToken = await prisma.verificationToken.findUnique({ where: { token } })
    if (!dbToken || dbToken.expires < new Date()) {
      return NextResponse.json({ error: 'Token invalid or expired' }, { status: 400 })
    }

    await prisma.user.update({
      where: { email: dbToken.identifier },
      data: { emailVerified: true },
    })

    await prisma.verificationToken.delete({ where: { token } })

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Verification error:', err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
