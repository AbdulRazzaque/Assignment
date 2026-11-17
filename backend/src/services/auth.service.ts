import { User } from '../models/user.model';
import { RegisterInput, LoginInput } from '../validators/auth.validator';
import { AppError } from '../utils/appError';
import { generateToken } from '../utils/jwt';
import { AuthUserPayload } from '../types';

export class AuthService {
  static async register(input: RegisterInput): Promise<{
    user: AuthUserPayload;
    token: string;
  }> {
    const existingUser = await User.findOne({ email: input.email.toLowerCase() });
    if (existingUser) {
      throw new AppError(409, 'An account with this email address already exists.');
    }

    const user = await User.create({
      name: input.name,
      email: input.email.toLowerCase(),
      password: input.password,
    });

    const userPayload: AuthUserPayload = {
      id: user._id.toString(),
      email: user.email,
      name: user.name,
    };

    const token = generateToken(userPayload);

    return { user: userPayload, token };
  }

  static async login(input: LoginInput): Promise<{
    user: AuthUserPayload;
    token: string;
  }> {
    const user = await User.findOne({ email: input.email.toLowerCase() }).select(
      '+password'
    );

    if (!user || !user.password) {
      throw new AppError(401, 'Invalid email or password.');
    }

    const isMatch = await user.comparePassword(input.password);
    if (!isMatch) {
      throw new AppError(401, 'Invalid email or password.');
    }

    const userPayload: AuthUserPayload = {
      id: user._id.toString(),
      email: user.email,
      name: user.name,
    };

    const token = generateToken(userPayload);

    return { user: userPayload, token };
  }

  static async getProfile(userId: string): Promise<AuthUserPayload> {
    const user = await User.findById(userId).select('_id email name createdAt');
    if (!user) {
      throw new AppError(404, 'User profile not found.');
    }

    return {
      id: user._id.toString(),
      email: user.email,
      name: user.name,
    };
  }
}
