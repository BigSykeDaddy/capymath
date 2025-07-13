// app/api/sessions/route.ts

import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import prisma from '@/lib/prisma'

export async function GET() {
  try {
    const sessions = await prisma.practiceSession.findMany({
      where: {
        user: {
          role: 'child',
        },
      },
      include: {
        user: true,
        problems: {
          select: {
            question: true,
            userAnswer: true,
            correct: true,
            timeMs: true,
            round: true,
          },
        },
      },
      orderBy: {
        startedAt: 'desc',
      },
    })

    return NextResponse.json(sessions)
  } catch (error) {
    console.error('[GET /api/sessions]', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== 'child') {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const body = await req.json()
    const { mode, problems } = body

    const newSession = await prisma.practiceSession.create({
      data: {
        userId: session.user.id,
        mode,
        startedAt: new Date(),
        completedAt: new Date(),
        problems: {
          create: problems,
        },
      },
    })

    return NextResponse.json(newSession, { status: 201 })
  } catch (error) {
    console.error('[POST /api/sessions]', error)
    return new NextResponse('Failed to save session', { status: 500 })
  }
}
