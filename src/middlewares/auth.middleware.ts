import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/token.util';
import { generateToken } from '../utils/token.util';
import { cookieOptions } from '../utils/cookie.util';
import { User } from '../models/user.model';
import { AppError } from '../utils/customError';
import { HTTP_STATUS } from '../constants/httpStatus';
import { MESSAGES } from '../constants/messages';

export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
  };
}

export const authMiddleware = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const token = req.cookies?.token;

    if (!token) {
      throw new AppError(MESSAGES.TOKEN_MISSING, HTTP_STATUS.UNAUTHORIZED);
    }

    const decoded = verifyToken(token);

    const user = await User.findById(decoded.id).select('-password -otp -otpExpiry');
    if (!user) {
      throw new AppError(MESSAGES.UNAUTHORIZED, HTTP_STATUS.UNAUTHORIZED);
    }

    // Sliding session: refresh token on every authenticated request
    const newToken = generateToken({ id: decoded.id, email: decoded.email });
    res.cookie('token', newToken, cookieOptions());

    req.user = {
      id: decoded.id,
      email: decoded.email,
    };

    next();
  } catch (error) {
    if (error instanceof AppError) {
      next(error);
    } else {
      next(new AppError(MESSAGES.TOKEN_INVALID, HTTP_STATUS.UNAUTHORIZED));
    }
  }
};
