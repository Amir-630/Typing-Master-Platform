// backend/src/controllers/auth.controller.ts
import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';
import { config } from '../config/env';

const prisma = new PrismaClient();

const registerSchema = z.object({
  email: z.string().email(),
  username: z.string().min(3).max(30),
  password: z.string().min(8),
  keyboardLayout: z.enum(['QWERTY', 'AZERTY', 'DVORAK', 'COLEMAK', 'QWERTZ']).optional()
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string()
});

export const authController = {
  async register(req: Request, res: Response) {
    try {
      const data = registerSchema.parse(req.body);
      
      // Check if user exists
      const existingUser = await prisma.user.findFirst({
        where: {
          OR: [
            { email: data.email },
            { username: data.username }
          ]
        }
      });
      
      if (existingUser) {
        return res.status(400).json({
          error: 'User with this email or username already exists'
        });
      }
      
      // Hash password
      const hashedPassword = await bcrypt.hash(data.password, 12);
      
      // Create user
      const user = await prisma.user.create({
        data: {
          email: data.email,
          username: data.username,
          password: hashedPassword,
          keyboardLayout: data.keyboardLayout || 'QWERTY'
        },
        select: {
          id: true,
          email: true,
          username: true,
          role: true,
          keyboardLayout: true,
          theme: true
        }
      });
      
      // Generate tokens
      const accessToken = jwt.sign(
        { userId: user.id, role: user.role },
        config.JWT_SECRET!,
        { expiresIn: '15m' }
      );
      
      const refreshToken = jwt.sign(
        { userId: user.id },
        config.JWT_REFRESH_SECRET!,
        { expiresIn: '7d' }
      );
      
      // Store refresh token
      res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: config.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000
      });
      
      res.status(201).json({
        user,
        accessToken
      });
      
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      res.status(500).json({ error: 'Registration failed' });
    }
  },
  
  async login(req: Request, res: Response) {
    try {
      const data = loginSchema.parse(req.body);
      
      // Find user
      const user = await prisma.user.findUnique({
        where: { email: data.email },
        select: {
          id: true,
          email: true,
          username: true,
          password: true,
          role: true,
          keyboardLayout: true,
          theme: true
        }
      });
      
      if (!user || !user.password) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }
      
      // Check password
      const validPassword = await bcrypt.compare(data.password, user.password);
      if (!validPassword) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }
      
      // Generate tokens
      const accessToken = jwt.sign(
        { userId: user.id, role: user.role },
        config.JWT_SECRET!,
        { expiresIn: '15m' }
      );
      
      const refreshToken = jwt.sign(
        { userId: user.id },
        config.JWT_REFRESH_SECRET!,
        { expiresIn: '7d' }
      );
      
      // Update last login
      await prisma.user.update({
        where: { id: user.id },
        data: { updatedAt: new Date() }
      });
      
      // Store refresh token
      res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: config.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000
      });
      
      const { password, ...userWithoutPassword } = user;
      
      res.json({
        user: userWithoutPassword,
        accessToken
      });
      
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      res.status(500).json({ error: 'Login failed' });
    }
  },
  
  async refreshToken(req: Request, res: Response) {
    try {
      const refreshToken = req.cookies.refreshToken;
      
      if (!refreshToken) {
        return res.status(401).json({ error: 'Refresh token required' });
      }
      
      const decoded = jwt.verify(refreshToken, config.JWT_REFRESH_SECRET!) as {
        userId: string;
      };
      
      const user = await prisma.user.findUnique({
        where: { id: decoded.userId },
        select: { id: true, role: true }
      });
      
      if (!user) {
        return res.status(401).json({ error: 'Invalid refresh token' });
      }
      
      const accessToken = jwt.sign(
        { userId: user.id, role: user.role },
        config.JWT_SECRET!,
        { expiresIn: '15m' }
      );
      
      res.json({ accessToken });
      
    } catch (error) {
      res.status(401).json({ error: 'Invalid refresh token' });
    }
  },
  
  async logout(req: Request, res: Response) {
    res.clearCookie('refreshToken');
    res.json({ message: 'Logged out successfully' });
  },
  
  async getProfile(req: Request, res: Response) {
    try {
      const userId = (req as any).userId;
      
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
          id: true,
          email: true,
          username: true,
          avatar: true,
          role: true,
          keyboardLayout: true,
          theme: true,
          soundEnabled: true,
          showHeatmap: true,
          level: true,
          xp: true,
          currentStreak: true,
          longestStreak: true,
          totalTime: true,
          totalLessons: true,
          avgWPM: true,
          avgAccuracy: true,
          createdAt: true
        }
      });
      
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      
      res.json(user);
      
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch profile' });
    }
  }
};