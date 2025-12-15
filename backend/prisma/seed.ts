import { PrismaClient } from '@prisma/client';
import { hash } from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  try {
    // Clear existing data in correct order
    console.log('🧹 Clearing existing data...');
    
    await prisma.userAchievement.deleteMany({});
    await prisma.leaderboardEntry.deleteMany({});
    await prisma.practiceSession.deleteMany({});
    await prisma.lessonProgress.deleteMany({});
    await prisma.achievement.deleteMany({});
    await prisma.lesson.deleteMany({});
    await prisma.category.deleteMany({});
    await prisma.user.deleteMany({});

    console.log('✅ Data cleared');

    // Create Admin User
    console.log('👤 Creating admin user...');
    const adminPassword = await hash('admin123', 12);
    const adminUser = await prisma.user.create({
      data: {
        email: 'admin@typingmaster.com',
        username: 'admin',
        password: adminPassword,
        role: 'ADMIN',
        keyboardLayout: 'QWERTY',
        theme: 'DARK',
        soundEnabled: true,
        showHeatmap: true,
        level: 10,
        xp: 5000,
        currentStreak: 15,
        longestStreak: 30,
        totalTime: 7200,
        totalLessons: 50,
        avgWPM: 65.5,
        avgAccuracy: 95.2,
      },
    });

    console.log('✅ Admin user created');

    // Create Test User
    console.log('👤 Creating test user...');
    const testPassword = await hash('test123', 12);
    const testUser = await prisma.user.create({
      data: {
        email: 'test@typingmaster.com',
        username: 'typinglearner',
        password: testPassword,
        role: 'USER',
        keyboardLayout: 'QWERTY',
        theme: 'LIGHT',
        soundEnabled: false,
        showHeatmap: true,
        level: 3,
        xp: 2500,
        currentStreak: 7,
        longestStreak: 21,
        totalTime: 3600,
        totalLessons: 15,
        avgWPM: 45.5,
        avgAccuracy: 92.3,
      },
    });

    console.log('✅ Test user created');

    // Create Categories
    console.log('📚 Creating categories...');
    
    const beginnerCategory = await prisma.category.create({
      data: {
        name: 'Beginner',
        description: 'Start your typing journey with basic keys',
        icon: '🎯',
        order: 1,
      },
    });

    const intermediateCategory = await prisma.category.create({
      data: {
        name: 'Intermediate',
        description: 'Improve speed and accuracy',
        icon: '⚡',
        order: 2,
      },
    });

    const advancedCategory = await prisma.category.create({
      data: {
        name: 'Advanced',
        description: 'Master complex typing patterns',
        icon: '🏆',
        order: 3,
      },
    });

    const expertCategory = await prisma.category.create({
      data: {
        name: 'Expert',
        description: 'Challenge yourself with difficult texts',
        icon: '🚀',
        order: 4,
      },
    });

    console.log('✅ Categories created');

    // Create Lessons
    console.log('📝 Creating lessons...');
    
    const beginnerLessons = [
      {
        title: 'Home Row Basics',
        description: 'Master the home row keys - the foundation of touch typing',
        content: 'asdf jkl; asdf jkl; asdf jkl; asdf jkl; asdf jkl; asdf jkl;',
        difficulty: 'BEGINNER' as const,
        order: 1,
        language: 'en',
        keyboardFocus: ['a', 's', 'd', 'f', 'j', 'k', 'l', ';'],
        expectedWPM: 20,
        minAccuracy: 85,
        timeEstimate: 5,
        categoryId: beginnerCategory.id,
      },
      {
        title: 'Top Row Introduction',
        description: 'Learn the keys above the home row',
        content: 'qwer tyui qwer tyui qwer tyui qwer tyui qwer tyui',
        difficulty: 'BEGINNER' as const,
        order: 2,
        language: 'en',
        keyboardFocus: ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i'],
        expectedWPM: 25,
        minAccuracy: 80,
        timeEstimate: 5,
        categoryId: beginnerCategory.id,
      },
    ];

    const intermediateLessons = [
      {
        title: 'Common Words',
        description: 'Practice with frequently used English words',
        content: 'The quick brown fox jumps over the lazy dog. Practice makes perfect.',
        difficulty: 'INTERMEDIATE' as const,
        order: 1,
        language: 'en',
        keyboardFocus: ['all'],
        expectedWPM: 35,
        minAccuracy: 90,
        timeEstimate: 10,
        categoryId: intermediateCategory.id,
      },
      {
        title: 'Punctuation Practice',
        description: 'Master punctuation keys and special characters',
        content: 'Hello, world! How are you? I\'m fine, thank you. This costs $19.99.',
        difficulty: 'INTERMEDIATE' as const,
        order: 2,
        language: 'en',
        keyboardFocus: [',', '.', '!', '?', '\'', '$'],
        expectedWPM: 30,
        minAccuracy: 85,
        timeEstimate: 10,
        categoryId: intermediateCategory.id,
      },
    ];

    for (const lesson of [...beginnerLessons, ...intermediateLessons]) {
      await prisma.lesson.create({
        data: lesson,
      });
    }

    console.log('✅ Lessons created');

    // Create Achievements with explicit enum casting
    console.log('🏆 Creating achievements...');
    
    // First approach: Use type assertion for each enum field
    const achievementsData = [
      {
        name: 'First Steps',
        description: 'Complete your first typing lesson',
        icon: '👣',
        criteriaType: 'TOTAL_LESSONS' as const,
        criteriaValue: 1,
        xpReward: 100,
        rarity: 'COMMON' as const,
      },
      {
        name: 'Speed Demon',
        description: 'Achieve 60 WPM in a single session',
        icon: '⚡',
        criteriaType: 'TOTAL_WPM' as const,
        criteriaValue: 60,
        xpReward: 500,
        rarity: 'RARE' as const,
      },
      {
        name: 'Accuracy Master',
        description: 'Achieve 99% accuracy in a lesson',
        icon: '🎯',
        criteriaType: 'ACCURACY' as const,
        criteriaValue: 99,
        xpReward: 300,
        rarity: 'RARE' as const,
      },
      {
        name: '7-Day Streak',
        description: 'Practice typing for 7 consecutive days',
        icon: '🔥',
        criteriaType: 'STREAK_DAYS' as const,
        criteriaValue: 7,
        xpReward: 1000,
        rarity: 'EPIC' as const,
      },
      {
        name: 'Marathon Typer',
        description: 'Spend 1 hour total in typing practice',
        icon: '🏃‍♂️',
        criteriaType: 'TOTAL_TIME' as const,
        criteriaValue: 3600,
        xpReward: 750,
        rarity: 'RARE' as const,
      },
      {
        name: 'Lesson Master',
        description: 'Complete 10 lessons',
        icon: '📚',
        criteriaType: 'TOTAL_LESSONS' as const,
        criteriaValue: 10,
        xpReward: 400,
        rarity: 'COMMON' as const,
      },
      {
        name: 'Perfect Lesson',
        description: 'Complete a lesson with 100% accuracy',
        icon: '💯',
        criteriaType: 'PERFECT_LESSON' as const,
        criteriaValue: 100,
        xpReward: 600,
        rarity: 'EPIC' as const,
      },
      {
        name: 'Level 5 Achiever',
        description: 'Reach level 5',
        icon: '⭐',
        criteriaType: 'LEVEL' as const,
        criteriaValue: 5,
        xpReward: 800,
        rarity: 'LEGENDARY' as const,
      },
    ];

    // Alternative approach: Create achievements one by one
    for (const data of achievementsData) {
      await prisma.achievement.create({
        data: {
          name: data.name,
          description: data.description,
          icon: data.icon,
          criteriaType: data.criteriaType,
          criteriaValue: data.criteriaValue,
          xpReward: data.xpReward,
          rarity: data.rarity,
        },
      });
    }

    console.log('✅ Achievements created');

    // Unlock First Steps achievement for test user
    console.log('🔓 Unlocking achievements...');
    const firstStepsAchievement = await prisma.achievement.findFirst({
      where: { name: 'First Steps' },
    });

    if (firstStepsAchievement) {
      await prisma.userAchievement.create({
        data: {
          userId: testUser.id,
          achievementId: firstStepsAchievement.id,
        },
      });
    }

    // Create Practice Sessions
    console.log('⌨️ Creating practice sessions...');
    const today = new Date();

    for (let i = 0; i < 10; i++) {
      const sessionDate = new Date(today);
      sessionDate.setDate(sessionDate.getDate() - i * 2);
      
      const sessionType = i % 3 === 0 ? 'LESSON' as const : 'PRACTICE' as const;
      const wpm = 40 + Math.random() * 30;
      const accuracy = 85 + Math.random() * 12;
      const duration = 60 + Math.random() * 300;
      
      const startTime = new Date(sessionDate);
      const endTime = new Date(startTime.getTime() + duration * 1000);
      
      await prisma.practiceSession.create({
        data: {
          userId: testUser.id,
          type: sessionType,
          duration: Math.floor(duration),
          wpm: parseFloat(wpm.toFixed(1)),
          accuracy: parseFloat(accuracy.toFixed(1)),
          errors: Math.floor(Math.random() * 20),
          totalKeys: Math.floor(200 + Math.random() * 800),
          keyPresses: {
            a: { total: 45, errors: 2, averageTime: 120, lastPressed: startTime.getTime() },
            s: { total: 38, errors: 1, averageTime: 115, lastPressed: startTime.getTime() },
            d: { total: 42, errors: 3, averageTime: 125, lastPressed: startTime.getTime() },
          },
          startTime: startTime,
          endTime: endTime,
        },
      });
    }

    console.log('✅ Practice sessions created');

    // Create Leaderboard Entries
    console.log('🏆 Creating leaderboard entries...');
    const weeklyStart = new Date();
    weeklyStart.setDate(weeklyStart.getDate() - weeklyStart.getDay());
    weeklyStart.setHours(0, 0, 0, 0);

    await prisma.leaderboardEntry.create({
      data: {
        userId: testUser.id,
        periodType: 'WEEKLY' as const,
        periodStart: weeklyStart,
        periodEnd: new Date(weeklyStart.getTime() + 7 * 24 * 60 * 60 * 1000),
        wpm: 65.5,
        accuracy: 94.2,
        totalSessions: 7,
        rank: 1,
      },
    });

    await prisma.leaderboardEntry.create({
      data: {
        userId: adminUser.id,
        periodType: 'WEEKLY' as const,
        periodStart: weeklyStart,
        periodEnd: new Date(weeklyStart.getTime() + 7 * 24 * 60 * 60 * 1000),
        wpm: 72.3,
        accuracy: 96.8,
        totalSessions: 12,
        rank: 2,
      },
    });

    console.log('✅ Leaderboard entries created');

    // Create Lesson Progress
    console.log('📊 Creating lesson progress...');
    
    const firstLesson = await prisma.lesson.findFirst({
      where: { title: 'Home Row Basics' },
    });

    const secondLesson = await prisma.lesson.findFirst({
      where: { title: 'Top Row Introduction' },
    });

    if (firstLesson) {
      await prisma.lessonProgress.create({
        data: {
          userId: testUser.id,
          lessonId: firstLesson.id,
          completed: true,
          bestWPM: 55.5,
          bestAccuracy: 98.2,
          attempts: 3,
          timeSpent: 900,
          lastAttempt: new Date(),
        },
      });
    }

    if (secondLesson) {
      await prisma.lessonProgress.create({
        data: {
          userId: testUser.id,
          lessonId: secondLesson.id,
          completed: true,
          bestWPM: 48.3,
          bestAccuracy: 95.7,
          attempts: 2,
          timeSpent: 600,
          lastAttempt: new Date(Date.now() - 86400000),
        },
      });
    }

    console.log('✅ Lesson progress created');

    console.log('\n🎉 Database seeding completed successfully!');
    console.log('\n📊 Summary:');
    console.log('   - Users: 2 (admin & test)');
    console.log('   - Categories: 4');
    console.log('   - Lessons: 4');
    console.log('   - Achievements: 8');
    console.log('   - Practice Sessions: 10');
    console.log('   - Leaderboard Entries: 2');
    console.log('   - Lesson Progress: 2');
    
    console.log('\n🔑 Login Credentials:');
    console.log('   Admin: admin@typingmaster.com / admin123');
    console.log('   Test User: test@typingmaster.com / test123');
    console.log('\n🚀 Start the servers and visit: http://localhost:3000');
    
  } catch (error) {
    console.error('❌ Error during database seeding:', error);
    if (error instanceof Error) {
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
    }
    throw error;
  }
}

main()
  .catch((error) => {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });