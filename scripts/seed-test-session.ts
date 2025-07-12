import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  const userId = '91d329f8-5af6-491d-adbe-45dc2e02ddb3' // your test user ID

  const session = await prisma.practiceSession.create({
    data: {
      userId,
      mode: 'quiz',
      startedAt: new Date(),
      completedAt: new Date(Date.now() + 5 * 60 * 1000), // +5 min
      problems: {
        create: [
          {
            question: '6 × 7',
            userAnswer: '42',
            correct: true,
            round: 1,
            timeMs: 2400,
          },
          {
            question: '9 × 5',
            userAnswer: '44',
            correct: false,
            round: 1,
            timeMs: 3500,
          },
        ],
      },
    },
  })

  console.log('✅ Seeded session with ID:', session.id)
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
