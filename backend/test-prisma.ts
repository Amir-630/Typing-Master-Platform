import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function testConnection() {
  try {
    console.log('Testing Prisma connection...');
    
    // Count users
    const userCount = await prisma.user.count();
    console.log(`Total users: ${userCount}`);
    
    // Get first user
    const firstUser = await prisma.user.findFirst();
    console.log('First user:', firstUser?.email);
    
    // Get all categories with lessons count
    const categories = await prisma.category.findMany({
      include: {
        lessons: {
          select: { id: true }
        }
      }
    });
    
    console.log('\nCategories:');
    categories.forEach(cat => {
      console.log(`- ${cat.name}: ${cat.lessons.length} lessons`);
    });
    
    console.log('\n✅ Prisma connection successful!');
    
  } catch (error) {
    console.error('❌ Prisma connection failed:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testConnection();