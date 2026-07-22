import pkg from '@prisma/client'
const { PrismaClient } = pkg

const prisma = new PrismaClient()

async function main() {
  console.log('🧪 Starting Database Comprehensive Test...\n')

  try {
    // 1. Create a Category
    console.log('1️⃣  Creating test Category...')
    const category = await prisma.category.create({
      data: {
        name: 'Test Category - ' + Date.now(),
      },
    })
    console.log(`   ✅ Category created: ID ${category.id}, Name: ${category.name}\n`)

    // 2. Create a Product in that Category
    console.log('2️⃣  Creating test Product...')
    const product = await prisma.product.create({
      data: {
        title: 'Test Product - ' + Date.now(),
        description: 'A product used for automated testing',
        price: 99.99,
        quantity: 10,
        categoryId: category.id,
      },
    })
    console.log(`   ✅ Product created: ID ${product.id}, Title: ${product.title}\n`)

    // 3. Create a User
    console.log('3️⃣  Creating test User...')
    const user = await prisma.user.create({
      data: {
        username: 'testuser_' + Date.now(),
        email: `testuser_${Date.now()}@example.com`,
      },
    })
    console.log(`   ✅ User created: ID ${user.id}, Username: ${user.username}\n`)

    // 4. Create an Order with OrderItems
    console.log('4️⃣  Creating test Order for the user...')
    const order = await prisma.order.create({
      data: {
        userId: user.id,
        phoneNumber: '+1234567890',
        deliveryAddress: '123 Test St',
        items: {
          create: [
            {
              productId: product.id,
              quantity: 2,
              productTitle: product.title,
              productPrice: product.price,
            },
          ],
        },
      },
      include: {
        items: true,
      },
    })
    console.log(`   ✅ Order created: ID ${order.id}, Status: ${order.status}`)
    console.log(`   ✅ Order Item linked: ${order.items[0].productTitle} (x${order.items[0].quantity})\n`)

    console.log('🎉 All creation tests passed successfully!\n')

    // 5. Cleanup
    console.log('🧹 Cleaning up test data...')
    await prisma.order.delete({ where: { id: order.id } })
    await prisma.user.delete({ where: { id: user.id } })
    await prisma.product.delete({ where: { id: product.id } })
    await prisma.category.delete({ where: { id: category.id } })
    console.log('   ✅ Test data removed from database.')

  } catch (error) {
    console.error('❌ Database Test Failed:', error)
  } finally {
    await prisma.$disconnect()
  }
}

main()
