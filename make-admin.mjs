import pkg from '@prisma/client'
const { PrismaClient } = pkg
const prisma = new PrismaClient()

async function main() {
  try {
    const user = await prisma.user.update({
      where: { email: 'lesleenyanducha@gmail.com' },
      data: { isAdmin: true },
    })
    console.log(`Success! User ${user.email} is now an admin. (isAdmin: ${user.isAdmin})`)
  } catch (error) {
    if (error.code === 'P2025') {
      console.error("User not found! Are you sure they registered with that exact email?")
    } else {
      console.error("Error making user admin:", error)
    }
  } finally {
    await prisma.$disconnect()
  }
}

main()
