-- CreateTable
CREATE TABLE `User` (
    `id` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `username` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NULL,
    `googleId` VARCHAR(191) NULL,
    `avatar` VARCHAR(191) NULL,
    `role` ENUM('USER', 'ADMIN') NOT NULL DEFAULT 'USER',
    `keyboardLayout` ENUM('QWERTY', 'AZERTY', 'DVORAK', 'COLEMAK', 'QWERTZ') NOT NULL DEFAULT 'QWERTY',
    `theme` ENUM('LIGHT', 'DARK', 'HIGH_CONTRAST') NOT NULL DEFAULT 'LIGHT',
    `soundEnabled` BOOLEAN NOT NULL DEFAULT true,
    `showHeatmap` BOOLEAN NOT NULL DEFAULT true,
    `level` INTEGER NOT NULL DEFAULT 1,
    `xp` INTEGER NOT NULL DEFAULT 0,
    `currentStreak` INTEGER NOT NULL DEFAULT 0,
    `longestStreak` INTEGER NOT NULL DEFAULT 0,
    `totalTime` INTEGER NOT NULL DEFAULT 0,
    `totalLessons` INTEGER NOT NULL DEFAULT 0,
    `avgWPM` DOUBLE NOT NULL DEFAULT 0,
    `avgAccuracy` DOUBLE NOT NULL DEFAULT 0,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `User_email_key`(`email`),
    UNIQUE INDEX `User_username_key`(`username`),
    UNIQUE INDEX `User_googleId_key`(`googleId`),
    INDEX `User_email_idx`(`email`),
    INDEX `User_level_idx`(`level`),
    INDEX `User_xp_idx`(`xp`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `PracticeSession` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `type` ENUM('LESSON', 'PRACTICE', 'TIMED_TEST', 'CUSTOM') NOT NULL,
    `textId` VARCHAR(191) NULL,
    `customText` VARCHAR(191) NULL,
    `duration` INTEGER NOT NULL,
    `wpm` DOUBLE NOT NULL,
    `accuracy` DOUBLE NOT NULL,
    `errors` INTEGER NOT NULL,
    `totalKeys` INTEGER NOT NULL,
    `keyPresses` JSON NOT NULL,
    `startTime` DATETIME(3) NOT NULL,
    `endTime` DATETIME(3) NOT NULL,
    `lessonId` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `PracticeSession_userId_idx`(`userId`),
    INDEX `PracticeSession_createdAt_idx`(`createdAt`),
    INDEX `PracticeSession_type_idx`(`type`),
    INDEX `PracticeSession_wpm_idx`(`wpm`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Lesson` (
    `id` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NULL,
    `content` VARCHAR(191) NOT NULL,
    `difficulty` ENUM('BEGINNER', 'INTERMEDIATE', 'ADVANCED', 'EXPERT') NOT NULL,
    `order` INTEGER NOT NULL,
    `language` VARCHAR(191) NOT NULL DEFAULT 'en',
    `keyboardFocus` JSON NOT NULL,
    `expectedWPM` INTEGER NOT NULL,
    `minAccuracy` DOUBLE NOT NULL,
    `timeEstimate` INTEGER NOT NULL,
    `categoryId` VARCHAR(191) NOT NULL,
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `Lesson_difficulty_idx`(`difficulty`),
    INDEX `Lesson_categoryId_idx`(`categoryId`),
    UNIQUE INDEX `Lesson_categoryId_order_key`(`categoryId`, `order`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Category` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NULL,
    `icon` VARCHAR(191) NULL,
    `order` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `Category_order_idx`(`order`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `LessonProgress` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `lessonId` VARCHAR(191) NOT NULL,
    `completed` BOOLEAN NOT NULL DEFAULT false,
    `bestWPM` DOUBLE NOT NULL,
    `bestAccuracy` DOUBLE NOT NULL,
    `attempts` INTEGER NOT NULL DEFAULT 0,
    `timeSpent` INTEGER NOT NULL DEFAULT 0,
    `lastAttempt` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `LessonProgress_userId_idx`(`userId`),
    INDEX `LessonProgress_lessonId_idx`(`lessonId`),
    UNIQUE INDEX `LessonProgress_userId_lessonId_key`(`userId`, `lessonId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Achievement` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NOT NULL,
    `icon` VARCHAR(191) NOT NULL,
    `criteriaType` ENUM('TOTAL_WPM', 'ACCURACY', 'STREAK_DAYS', 'TOTAL_LESSONS', 'TOTAL_TIME', 'PERFECT_LESSON', 'LEVEL') NOT NULL,
    `criteriaValue` INTEGER NOT NULL,
    `xpReward` INTEGER NOT NULL,
    `rarity` ENUM('COMMON', 'RARE', 'EPIC', 'LEGENDARY') NOT NULL DEFAULT 'COMMON',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `Achievement_criteriaType_idx`(`criteriaType`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `UserAchievement` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `achievementId` VARCHAR(191) NOT NULL,
    `unlockedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `progress` INTEGER NULL,

    INDEX `UserAchievement_userId_idx`(`userId`),
    INDEX `UserAchievement_achievementId_idx`(`achievementId`),
    UNIQUE INDEX `UserAchievement_userId_achievementId_key`(`userId`, `achievementId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `LeaderboardEntry` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `periodType` ENUM('DAILY', 'WEEKLY', 'MONTHLY', 'ALL_TIME') NOT NULL,
    `periodStart` DATETIME(3) NOT NULL,
    `periodEnd` DATETIME(3) NOT NULL,
    `wpm` DOUBLE NOT NULL,
    `accuracy` DOUBLE NOT NULL,
    `totalSessions` INTEGER NOT NULL,
    `rank` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `LeaderboardEntry_periodType_periodStart_idx`(`periodType`, `periodStart`),
    INDEX `LeaderboardEntry_wpm_idx`(`wpm`),
    INDEX `LeaderboardEntry_rank_idx`(`rank`),
    UNIQUE INDEX `LeaderboardEntry_userId_periodType_periodStart_key`(`userId`, `periodType`, `periodStart`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `TextContent` (
    `id` VARCHAR(191) NOT NULL,
    `content` VARCHAR(191) NOT NULL,
    `source` VARCHAR(191) NOT NULL,
    `category` VARCHAR(191) NOT NULL,
    `difficulty` ENUM('BEGINNER', 'INTERMEDIATE', 'ADVANCED', 'EXPERT') NOT NULL,
    `language` VARCHAR(191) NOT NULL DEFAULT 'en',
    `length` INTEGER NOT NULL,
    `wordCount` INTEGER NOT NULL,
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `PracticeSession` ADD CONSTRAINT `PracticeSession_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PracticeSession` ADD CONSTRAINT `PracticeSession_lessonId_fkey` FOREIGN KEY (`lessonId`) REFERENCES `Lesson`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Lesson` ADD CONSTRAINT `Lesson_categoryId_fkey` FOREIGN KEY (`categoryId`) REFERENCES `Category`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `LessonProgress` ADD CONSTRAINT `LessonProgress_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `LessonProgress` ADD CONSTRAINT `LessonProgress_lessonId_fkey` FOREIGN KEY (`lessonId`) REFERENCES `Lesson`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UserAchievement` ADD CONSTRAINT `UserAchievement_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UserAchievement` ADD CONSTRAINT `UserAchievement_achievementId_fkey` FOREIGN KEY (`achievementId`) REFERENCES `Achievement`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `LeaderboardEntry` ADD CONSTRAINT `LeaderboardEntry_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
