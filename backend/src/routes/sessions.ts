import { PrismaClient } from '@prisma/client';
import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import { TypingService } from '../services/typing.service';

const router = Router();
const prisma = new PrismaClient();

// Save session
router.post('/', authenticate, async (req, res) => {
  try {
    const { type, lessonId, duration, wpm, accuracy, errors, totalKeys, keyPresses } = req.body;
    
    const session = await TypingService.saveSession(req.userId!, {
      wpm,
      accuracy,
      errors,
      totalKeys,
      keyPresses,
      duration,
      lessonId
    });
    
    res.status(201).json(session);
  } catch (error) {
    res.status(500).json({ error: 'Failed to save session' });
  }
});

// Get user sessions
router.get('/', authenticate, async (req, res) => {
  try {
    const sessions = await prisma.practiceSession.findMany({
      where: { userId: req.userId },
      orderBy: { createdAt: 'desc' },
      take: 50
    });
    res.json(sessions);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch sessions' });
  }
});

export default router;
