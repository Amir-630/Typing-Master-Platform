// frontend/src/types/index.ts
export interface User {
  id: string;
  email: string;
  username: string;
  avatar?: string;
  role: 'USER' | 'ADMIN';
  keyboardLayout: KeyboardLayout;
  theme: Theme;
  soundEnabled: boolean;
  showHeatmap: boolean;
  level: number;
  xp: number;
  currentStreak: number;
  longestStreak: number;
  totalTime: number;
  totalLessons: number;
  avgWPM: number;
  avgAccuracy: number;
  createdAt: string;
}

export type KeyboardLayout = 'QWERTY' | 'AZERTY' | 'DVORAK' | 'COLEMAK' | 'QWERTZ';
export type Theme = 'LIGHT' | 'DARK' | 'HIGH_CONTRAST';
export type Difficulty = 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'EXPERT';
export type SessionType = 'LESSON' | 'PRACTICE' | 'TIMED_TEST' | 'CUSTOM';

export interface Lesson {
  id: string;
  title: string;
  description?: string;
  content: string;
  difficulty: Difficulty;
  order: number;
  language: string;
  keyboardFocus: string[];
  expectedWPM: number;
  minAccuracy: number;
  timeEstimate: number;
  categoryId: string;
  isActive: boolean;
}

export interface TypingSession {
  id: string;
  type: SessionType;
  duration: number;
  wpm: number;
  accuracy: number;
  errors: number;
  totalKeys: number;
  keyPresses: KeyPressData;
  startTime: string;
  endTime: string;
  lessonId?: string;
}

export interface KeyPressData {
  [key: string]: {
    total: number;
    errors: number;
    averageTime: number;
    lastPressed: number;
  };
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  criteriaType: string;
  criteriaValue: number;
  xpReward: number;
  rarity: 'COMMON' | 'RARE' | 'EPIC' | 'LEGENDARY';
  unlockedAt?: string;
}

export interface LeaderboardEntry {
  id: string;
  user: {
    id: string;
    username: string;
    avatar?: string;
  };
  wpm: number;
  accuracy: number;
  totalSessions: number;
  rank: number;
  periodType: 'DAILY' | 'WEEKLY' | 'ALL_TIME';
}