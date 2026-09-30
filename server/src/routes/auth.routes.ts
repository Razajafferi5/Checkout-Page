import { Router } from 'express';
import { login, logout, getMe } from '../controllers/auth.controller';
import { authenticateUser } from '../middleware/auth';

export const authRoutes = Router();

// POST /api/auth/login
authRoutes.post('/login', login);

// POST /api/auth/logout
authRoutes.post('/logout', authenticateUser, logout);

// GET /api/auth/me
authRoutes.get('/me', authenticateUser, getMe);
