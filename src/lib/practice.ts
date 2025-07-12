import prisma from './prisma'

type PracticeMode = 'quiz' | 'memorization'

interface LogAttemptParams {
  userId: string
  problem: string       // e.g., "7x8"
  correct: boolean
  timeMs: number
  mode: PracticeMode
}

/**
 * Logs a single practice attempt for the given user.
 */
export async function logAttempt({
  userId,
  problem,
  correct,
  timeMs,
  mode,
}: LogAttemptParams) {
  try {
    const result = await prisma.attempt.create({
      data: {
        userId,
        problem,
        correct,
        timeMs,
        mode,
      },
    })

    return result
  } catch (error) {
    console.error('Error logging attempt:', error)
    throw error
  }
}

/**
 * Fetches recent incorrect attempts for a user.
 */
export async function getIncorrectAttempts(userId: string, limit = 50) {
  return prisma.attempt.findMany({
    where: {
      userId,
      correct: false,
    },
    orderBy: {
      attemptedAt: 'desc',
    },
    take: limit,
  })
}

/**
 * Fetch all attempts by mode and date (useful for reporting).
 */
export async function getAttemptsByDate(userId: string, mode?: PracticeMode) {
  return prisma.attempt.findMany({
    where: {
      userId,
      ...(mode ? { mode } : {}),
    },
    orderBy: {
      attemptedAt: 'desc',
    },
  })
}
