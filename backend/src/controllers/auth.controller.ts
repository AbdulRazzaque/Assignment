import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/auth.service';
import { ApiResponse } from '../utils/apiResponse';
import { setAuthCookie, clearAuthCookie } from '../utils/jwt';
import { AuthRequest } from '../types';
import { RegisterInput, LoginInput } from '../validators/auth.validator';

export class AuthController {
  static async register(
    req: Request<unknown, unknown, RegisterInput>,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { user, token } = await AuthService.register(req.body);

      // Set secure HTTP-only cookie
      setAuthCookie(res, token);

      ApiResponse.success(
        res,
        'Account registered successfully',
        { user, token },
        201
      );
    } catch (error) {
      next(error);
    }
  }

  static async login(
    req: Request<unknown, unknown, LoginInput>,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { user, token } = await AuthService.login(req.body);

      // Set secure HTTP-only cookie
      setAuthCookie(res, token);

      ApiResponse.success(res, 'Logged in successfully', { user, token }, 200);
    } catch (error) {
      next(error);
    }
  }

  static async logout(_req: Request, res: Response): Promise<void> {
    clearAuthCookie(res);
    ApiResponse.success(res, 'Logged out successfully', null, 200);
  }

  static async getMe(
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const user = await AuthService.getProfile(req.user!.id);
      ApiResponse.success(res, 'Profile retrieved successfully', { user }, 200);
    } catch (error) {
      next(error);
    }
  }
}
