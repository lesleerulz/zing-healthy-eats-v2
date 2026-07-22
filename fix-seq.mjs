import pkg from '@prisma/client'
const { PrismaClient } = pkg
const prisma = new PrismaClient()

async function main() {
  try {
    await prisma.$executeRawUnsafe(`SELECT setval('category_id_seq', COALESCE((SELECT MAX(id)+1 FROM "category"), 1), false);`)
    await prisma.$executeRawUnsafe(`SELECT setval('product_id_seq', COALESCE((SELECT MAX(id)+1 FROM "product"), 1), false);`)
    await prisma.$executeRawUnsafe(`SELECT setval('user_id_seq', COALESCE((SELECT MAX(id)+1 FROM "user"), 1), false);`)
    await prisma.$executeRawUnsafe(`SELECT setval('order_id_seq', COALESCE((SELECT MAX(id)+1 FROM "order"), 1), false);`)
    await prisma.$executeRawUnsafe(`SELECT setval('order_item_id_seq', COALESCE((SELECT MAX(id)+1 FROM "order_item"), 1), false);`)
    console.log("Sequences fixed successfully!")
  } catch(e) {
    console.error("Failed to fix sequences:", e)
  } finally {
    await prisma.$disconnect()
  }
}
main()
