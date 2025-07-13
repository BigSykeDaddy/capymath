// src/app/api/auth/signup/route.ts
import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import bcrypt from 'bcryptjs'
// import { sendVerificationEmail } from '@/lib/email'  // ⛔️ Disabled temporarily
import { randomUUID } from 'crypto'

export async function POST(req: Request) {
  try {
    const { email, password, name } = await req.json()

    if (!email || !password || !name) {
      return NextResponse.json({ error: 'Email, name, and password required' }, { status: 400 })
    }

    const existing = await prisma.user.findUnique({ where: { email } })
    if (existing) {
      return NextResponse.json({ error: 'User already exists' }, { status: 409 })
    }

    const passwordHash = await bcrypt.hash(password, 10)
    const verificationToken = randomUUID()
    const tokenExpires = new Date(Date.now() + 1000 * 60 * 60 * 24) // 24 hours

    const user = await prisma.user.create({
      data: {
        email,
        name,
        passwordHash,
        role: 'child',
        verificationToken,
        verificationTokenExpires: tokenExpires,
        emailVerified: true, // ✅ Pretend the user verified their email
      },
    })

    // await sendVerificationEmail(email, verificationToken) // ⛔️ Disabled

    return NextResponse.json({ success: true, userId: user.id })
  } catch (err) {
    console.error('Sign-up error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
