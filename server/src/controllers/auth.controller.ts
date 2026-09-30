import { Request, Response, NextFunction } from 'express';
import { dataStore } from '../config/dataStore';
import { generateToken, logAuditEvent } from '../middleware/auth';
import { ROLE_PERMISSIONS } from '../models/User';
import { logger } from '../utils/logger';

export async function login(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({
        success: false,
        error: {
          code: 'INVALID_CREDENTIALS',
          message: 'Both email and password are required.',
        },
      });
      return;
    }

    const user = await dataStore.findUserByEmail(email);

    if (!user) {
      await logAuditEvent(req, 'LOGIN', email, 'FAILURE', { reason: 'User not found' });
      res.status(401).json({
        success: false,
        error: {
          code: 'INVALID_CREDENTIALS',
          message: 'Invalid email address or security credential.',
        },
      });
      return;
    }

    if (!user.active) {
      await logAuditEvent(req, 'LOGIN', email, 'FAILURE', { reason: 'Account inactive' });
      res.status(403).json({
        success: false,
        error: {
          code: 'ACCOUNT_DEACTIVATED',
          message: 'Account is deactivated. Contact internal systems administrator.',
        },
      });
      return;
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      await logAuditEvent(req, 'LOGIN', email, 'FAILURE', { reason: 'Incorrect password' });
      res.status(401).json({
        success: false,
        error: {
          code: 'INVALID_CREDENTIALS',
          message: 'Invalid email address or security credential.',
        },
      });
      return;
    }

    // Update last login
    user.lastLogin = new Date();
    await dataStore.updateUser(user);

    const token = generateToken(user);
    const permissions = ROLE_PERMISSIONS[user.role] || [];

    // Log successful login audit
    await logAuditEvent(
      { ...req, user: { id: user._id.toString(), email: user.email, role: user.role, firstName: user.firstName, lastName: user.lastName, permissions } } as any,
      'LOGIN',
      email,
      'SUCCESS',
      { role: user.role }
    );

    res.status(200).json({
      success: true,
      data: {
        token,
        user: {
          id: user._id.toString(),
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
          permissions,
          lastLogin: user.lastLogin,
        },
      },
    });
  } catch (err) {
    logger.error('Login error', err);
    next(err);
  }
}

export async function logout(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    if (req.user) {
      await logAuditEvent(req, 'LOGOUT', req.user.email, 'SUCCESS');
    }
    res.status(200).json({
      success: true,
      data: {
        message: 'Signed out successfully.',
      },
    });
  } catch (err) {
    logger.error('Logout error', err);
    next(err);
  }
}

export async function getMe(req: Request, res: Response): Promise<void> {
  if (!req.user) {
    res.status(401).json({
      success: false,
      error: { code: 'UNAUTHORIZED', message: 'Not authenticated.' },
    });
    return;
  }

  res.status(200).json({
    success: true,
    data: {
      user: req.user,
    },
  });
}
