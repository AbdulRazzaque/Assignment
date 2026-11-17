import { Response, NextFunction } from 'express';
import { AuthRequest } from '../types';
import { verifyToken } from '../utils/jwt';
import { AppError } from '../utils/appError';
import { User } from '../models/user.model';

export const requireAuth = async (
  req: AuthRequest,
  _res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    let token: string | undefined;

    // 1. Check cookies first (standard for web app with HTTP-only cookies)
    if (req.cookies && req.cookies.token) {
      token = req.cookies.token;
    }
    // 2. Check Authorization header as fallback (Bearer token)
    else if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer ')
    ) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return next(new AppError(401, 'Authentication required. Please log in.'));
    }

    // Verify token
    const decoded = verifyToken(token);

    // Verify user still exists in database
    const currentUser = await User.findById(decoded.id).select('_id email name');
    if (!currentUser) {
      return next(
        new AppError(401, 'The user belonging to this token no longer exists.')
      );
    }

    req.user = {
      id: currentUser._id.toString(),
      email: currentUser.email,
      name: currentUser.name,
    };

    next();
  } catch (error) {
    return next(new AppError(401, 'Invalid or expired session. Please log in again.'));
  }
};
