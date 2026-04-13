import { CookieOptions } from 'express';
import { env } from '../config/env';

export const cookieOptions = (): CookieOptions => {
  return {
    httpOnly: true,
    secure: env.NODE_ENV === 'production',
    sameSite: env.NODE_ENV === 'production' ? 'strict' : 'lax',
    maxAge: 15 * 24 * 60 * 60 * 1000, // 15 days
    path: '/',
  };
};
