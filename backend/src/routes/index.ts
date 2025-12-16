import { Router } from 'express';
import achievementsRoutes from './achievements';
import authRoutes from './auth';
import leaderboardRoutes from './leaderboard';
import lessonsRoutes from './lessons';
import sessionsRoutes from './sessions';

const router = Router();

router.use('/auth', authRoutes);
router.use('/sessions', sessionsRoutes);
router.use('/leaderboard', leaderboardRoutes);
router.use('/achievements', achievementsRoutes);
router.use('/lessons', lessonsRoutes);

// Health check
router.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

export default router;
