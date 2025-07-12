import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  const user = await prisma.user.create({
    data: {
      email: 'test@capymath.com',
      name: 'Test Child',
      role: 'child',
    },
  })

  console.log('✅ Created test user with ID:', user.id)
}

main()
  .catch((e) => {
    console.error('❌ Error creating user:', e)
  })
  .finally(() => prisma.$disconnect())
