import { PrismaClient } from '@prisma/client';
import { Router } from 'express';

const router = Router();
const prisma = new PrismaClient();

router.get('/', async (req, res) => {
  try {
    const lessons = await prisma.lesson.findMany({
      where: { isActive: true },
      include: { category: true },
      orderBy: [{ category: { order: 'asc' } }, { order: 'asc' }]
    });
    res.json(lessons);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch lessons' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const lesson = await prisma.lesson.findUnique({
      where: { id: req.params.id },
      include: { category: true }
    });
    if (!lesson) {
      return res.status(404).json({ error: 'Lesson not found' });
    }
    res.json(lesson);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch lesson' });
  }
});

export default router;
