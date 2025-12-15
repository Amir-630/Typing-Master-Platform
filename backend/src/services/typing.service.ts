// backend/src/services/typing.service.ts
import { PrismaClient, SessionType } from '@prisma/client';

const prisma = new PrismaClient();

interface TypingResult {
  wpm: number;
  accuracy: number;
  errors: number;
  totalKeys: number;
  keyPresses: Record<string, any>;
  duration: number; // in seconds
  textId?: string;
  customText?: string;
  lessonId?: string;
}

interface PerformanceMetrics {
  wpm: number;
  accuracy: number;
  rawWpm: number;
  correctedErrors: number;
  uncorrectedErrors: number;
  consistency: number;
}

export class TypingService {
  static calculateWPM(
    correctChars: number,
    timeInMinutes: number
  ): number {
    // WPM = (correct characters / 5) / time in minutes
    return (correctChars / 5) / timeInMinutes;
  }
  
  static calculateAccuracy(
    totalChars: number,
    errors: number
  ): number {
    return ((totalChars - errors) / totalChars) * 100;
  }
  
  static async saveSession(
    userId: string,
    result: TypingResult,
    type: SessionType = SessionType.PRACTICE
  ) {
    const session = await prisma.practiceSession.create({
      data: {
        userId,
        type,
        textId: result.textId,
        customText: result.customText,
        lessonId: result.lessonId,
        duration: result.duration,
        wpm: result.wpm,
        accuracy: result.accuracy,
        errors: result.errors,
        totalKeys: result.totalKeys,
        keyPresses: result.keyPresses,
        startTime: new Date(Date.now() - result.duration * 1000),
        endTime: new Date()
      }
    });
    
    // Update user stats
    await this.updateUserStats(userId, result);
    
    // Check achievements
    await this.checkAchievements(userId, result);
    
    // Update leaderboard
    await this.updateLeaderboard(userId, result);
    
    return session;
  }
  
  private static async updateUserStats(
    userId: string,
    result: TypingResult
  ) {
    const user = await prisma.user.findUnique({
      where: { id: userId }
    });
    
    if (!user) return;
    
    // Calculate new averages
    const totalSessions = await prisma.practiceSession.count({
      where: { userId }
    });
    
    const newAvgWPM = (user.avgWPM * (totalSessions - 1) + result.wpm) / totalSessions;
    const newAvgAccuracy = (user.avgAccuracy * (totalSessions - 1) + result.accuracy) / totalSessions;
    
    // Check streak
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    const lastSession = await prisma.practiceSession.findFirst({
      where: {
        userId,
        endTime: {
          gte: yesterday
        }
      },
      orderBy: { endTime: 'desc' }
    });
    
    let newStreak = user.currentStreak;
    const lastSessionDate = lastSession?.endTime;
    
    if (lastSessionDate) {
      const lastSessionDay = new Date(lastSessionDate);
      lastSessionDay.setHours(0, 0, 0, 0);
      
      if (lastSessionDay.getTime() === yesterday.getTime()) {
        // User practiced yesterday, continue streak
        newStreak += 1;
      } else if (lastSessionDay.getTime() < yesterday.getTime()) {
        // Streak broken
        newStreak = 1;
      }
    } else {
      // First session
      newStreak = 1;
    }
    
    // Update user
    await prisma.user.update({
      where: { id: userId },
      data: {
        totalTime: user.totalTime + result.duration,
        totalLessons: result.lessonId ? user.totalLessons + 1 : user.totalLessons,
        avgWPM: newAvgWPM,
        avgAccuracy: newAvgAccuracy,
        currentStreak: newStreak,
        longestStreak: Math.max(user.longestStreak, newStreak),
        xp: user.xp + Math.floor(result.wpm * result.accuracy / 10),
        level: Math.floor((user.xp + Math.floor(result.wpm * result.accuracy / 10)) / 1000) + 1
      }
    });
  }
  
  private static async checkAchievements(
    userId: string,
    result: TypingResult
  ) {
    const achievements = await prisma.achievement.findMany({
      where: {
        NOT: {
          users: {
            some: { userId }
          }
        }
      }
    });
    
    for (const achievement of achievements) {
      let unlocked = false;
      
      switch (achievement.criteriaType) {
        case 'TOTAL_WPM':
          const user = await prisma.user.findUnique({
            where: { id: userId }
          });
          if (user && user.avgWPM >= achievement.criteriaValue) {
            unlocked = true;
          }
          break;
          
        case 'ACCURACY':
          if (result.accuracy >= achievement.criteriaValue) {
            unlocked = true;
          }
          break;
          
        case 'STREAK_DAYS':
          const userWithStreak = await prisma.user.findUnique({
            where: { id: userId }
          });
          if (userWithStreak && userWithStreak.currentStreak >= achievement.criteriaValue) {
            unlocked = true;
          }
          break;
      }
      
      if (unlocked) {
        await prisma.userAchievement.create({
          data: {
            userId,
            achievementId: achievement.id
          }
        });
      }
    }
  }
  
  private static async updateLeaderboard(
    userId: string,
    result: TypingResult
  ) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const weekStart = new Date(today);
    weekStart.setDate(weekStart.getDate() - weekStart.getDay());
    
    // Update daily leaderboard
    await this.upsertLeaderboardEntry(userId, 'DAILY', today, result);
    
    // Update weekly leaderboard
    await this.upsertLeaderboardEntry(userId, 'WEEKLY', weekStart, result);
    
    // Update all-time leaderboard
    const allTimeStart = new Date(0);
    await this.upsertLeaderboardEntry(userId, 'ALL_TIME', allTimeStart, result);
  }
  
  private static async upsertLeaderboardEntry(
    userId: string,
    periodType: 'DAILY' | 'WEEKLY' | 'ALL_TIME',
    periodStart: Date,
    result: TypingResult
  ) {
    const existing = await prisma.leaderboardEntry.findUnique({
      where: {
        userId_periodType_periodStart: {
          userId,
          periodType,
          periodStart
        }
      }
    });
    
    if (existing) {
      // Update existing entry
      const sessionsCount = existing.totalSessions + 1;
      const newWPM = (existing.wpm * existing.totalSessions + result.wpm) / sessionsCount;
      const newAccuracy = (existing.accuracy * existing.totalSessions + result.accuracy) / sessionsCount;
      
      await prisma.leaderboardEntry.update({
        where: { id: existing.id },
        data: {
          wpm: newWPM,
          accuracy: newAccuracy,
          totalSessions: sessionsCount
        }
      });
    } else {
      // Create new entry
      await prisma.leaderboardEntry.create({
        data: {
          userId,
          periodType,
          periodStart,
          periodEnd: new Date(periodStart.getTime() + (periodType === 'DAILY' ? 86400000 : 604800000)),
          wpm: result.wpm,
          accuracy: result.accuracy,
          totalSessions: 1
        }
      });
    }
    
    // Recalculate ranks
    await this.calculateRanks(periodType, periodStart);
  }
  
  private static async calculateRanks(
    periodType: 'DAILY' | 'WEEKLY' | 'ALL_TIME',
    periodStart: Date
  ) {
    const entries = await prisma.leaderboardEntry.findMany({
      where: {
        periodType,
        periodStart
      },
      orderBy: [
        { wpm: 'desc' },
        { accuracy: 'desc' }
      ]
    });
    
    for (let i = 0; i < entries.length; i++) {
      await prisma.leaderboardEntry.update({
        where: { id: entries[i].id },
        data: { rank: i + 1 }
      });
    }
  }
}