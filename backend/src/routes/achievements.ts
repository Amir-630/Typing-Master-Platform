import { PrismaClient } from '@prisma/client';
import { Router } from 'express';
import { authenticate } from '../middleware/auth';

const router = Router();
const prisma = new PrismaClient();

router.get('/', async (req, res) => {
  try {
    const achievements = await prisma.achievement.findMany();
    res.json(achievements);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch achievements' });
  }
});

router.get('/user/:userId', authenticate, async (req, res) => {
  try {
    const achievements = await prisma.userAchievement.findMany({
      where: { userId: req.params.userId },
      include: { achievement: true }
    });
    res.json(achievements);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch user achievements' });
  }
});

export default router;
