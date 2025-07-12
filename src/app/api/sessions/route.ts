// app/api/sessions/route.ts

import { NextResponse } from 'next/server'
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
