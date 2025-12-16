import { PrismaClient } from '@prisma/client';
import { Router } from 'express';

const router = Router();
const prisma = new PrismaClient();

router.get('/:period', async (req, res) => {
  try {
    const { period } = req.params;
    const periodType = period.toUpperCase() === 'ALL-TIME' ? 'ALL_TIME' : period.toUpperCase();
    
    const entries = await prisma.leaderboardEntry.findMany({
      where: { periodType: periodType as any },
      orderBy: { rank: 'asc' },
      include: {
        user: {
          select: { id: true, username: true, avatar: true }
        }
      },
      take: 100
    });
    
    res.json(entries);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch leaderboard' });
  }
});

export default router;
