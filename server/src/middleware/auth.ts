import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { ENV } from '../config/env';
import { dataStore } from '../config/dataStore';
import { UserRole, Permission, ROLE_PERMISSIONS, IUser } from '../models/User';
import { AuditLog, AuditAction } from '../models/AuditLog';
import { logger } from '../utils/logger';

export interface AuthenticatedUserPayload {
  id: string;
  email: string;
  role: UserRole;
  firstName: string;
  lastName: string;
  permissions: Permission[];
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthenticatedUserPayload;
    }
  }
}

/**
 * Generates signed JWT for internal users
 */
export function generateToken(user: IUser): string {
  const payload = {
    id: user._id.toString(),
    email: user.email,
    role: user.role,
    firstName: user.firstName,
    lastName: user.lastName,
  };

  return jwt.sign(payload, ENV.JWT_SECRET, {
    expiresIn: ENV.JWT_EXPIRES_IN as any,
  });
}

/**
 * Middleware: Verifies JWT token and attaches authenticated user to request
 */
export async function authenticateUser(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    let token: string | undefined;

    // 1. Check Bearer token in Authorization header
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.split(' ')[1];
    } else if (req.headers['x-access-token']) {
      token = req.headers['x-access-token'] as string;
    }

    if (!token) {
      res.status(401).json({
        success: false,
        error: {
          code: 'UNAUTHORIZED',
          message: 'Authentication required. Please sign in to access internal tools.',
        },
      });
      return;
    }

    // 2. Verify JWT signature & expiration
    let decoded: any;
    try {
      decoded = jwt.verify(token, ENV.JWT_SECRET);
    } catch (jwtErr: any) {
      const isExpired = jwtErr.name === 'TokenExpiredError';
      res.status(401).json({
        success: false,
        error: {
          code: isExpired ? 'TOKEN_EXPIRED' : 'INVALID_TOKEN',
          message: isExpired ? 'Session expired. Please sign in again.' : 'Invalid security token.',
        },
      });
      return;
    }

    // 3. Verify user exists and is active
    const user = await dataStore.findUserById(decoded.id);
    if (!user || !user.active) {
      res.status(401).json({
        success: false,
        error: {
          code: 'USER_DEACTIVATED',
          message: 'Account not found or inactive. Contact security administrator.',
        },
      });
      return;
    }

    const permissions = ROLE_PERMISSIONS[user.role] || [];

    req.user = {
      id: user._id.toString(),
      email: user.email,
      role: user.role,
      firstName: user.firstName,
      lastName: user.lastName,
      permissions,
    };

    next();
  } catch (err) {
    logger.error('Authentication middleware error', err);
    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_AUTH_ERROR',
        message: 'Security validation error.',
      },
    });
  }
}

/**
 * Middleware: Requires one of the specified roles (e.g. 'OPERATIONS', 'SANDBOX_ADMIN')
 */
export function requireRole(...allowedRoles: UserRole[]) {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({
        success: false,
        error: {
          code: 'UNAUTHORIZED',
          message: 'Authentication required.',
        },
      });
      return;
    }

    if (!allowedRoles.includes(req.user.role)) {
      logAuditEvent(req, 'LOGIN', req.originalUrl, 'FAILURE', {
        reason: 'Forbidden role access',
        requiredRoles: allowedRoles,
        userRole: req.user.role,
      }).catch(() => {});

      res.status(403).json({
        success: false,
        error: {
          code: 'FORBIDDEN',
          message: `Access denied. Requires one of [${allowedRoles.join(', ')}] role.`,
        },
      });
      return;
    }

    next();
  };
}

/**
 * Middleware: Requires a specific permission (e.g. 'RUN_PAYMENT_TEST')
 */
export function requirePermission(...requiredPermissions: Permission[]) {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({
        success: false,
        error: {
          code: 'UNAUTHORIZED',
          message: 'Authentication required.',
        },
      });
      return;
    }

    const userPermissions = req.user.permissions;
    const hasAll = requiredPermissions.every(p => userPermissions.includes(p));

    if (!hasAll) {
      res.status(403).json({
        success: false,
        error: {
          code: 'INSUFFICIENT_PERMISSIONS',
          message: `Insufficient permissions. Required: [${requiredPermissions.join(', ')}].`,
        },
      });
      return;
    }

    next();
  };
}

/**
 * Helper to record security and operational audit trail
 */
export async function logAuditEvent(
  req: Request,
  action: AuditAction,
  resource?: string,
  result: 'SUCCESS' | 'FAILURE' = 'SUCCESS',
  details?: Record<string, unknown>
): Promise<void> {
  try {
    const audit = new AuditLog({
      userId: req.user?.id,
      userEmail: req.user?.email || 'unauthenticated',
      userRole: req.user?.role || 'OPERATIONS',
      action,
      resource,
      ip: req.ip || (req.headers ? (req.headers['x-forwarded-for'] as string) : undefined) || req.socket?.remoteAddress || '127.0.0.1',
      result,
      details,
    });

    await dataStore.saveAuditLog(audit);
  } catch (err) {
    logger.error('Failed to write audit log', err);
  }
}
