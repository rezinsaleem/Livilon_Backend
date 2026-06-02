import { Request, Response, NextFunction } from 'express';
import * as authService from '../services/auth.service';
import { sendSuccess } from '../utils/apiResponse.util';
import { cookieOptions } from '../utils/cookie.util';
import { HTTP_STATUS } from '../constants/httpStatus';
import { MESSAGES } from '../constants/messages';

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;
    const result = await authService.loginUser(email, password);

    res.cookie('token', result.token, cookieOptions());
    sendSuccess(res, HTTP_STATUS.OK, MESSAGES.LOGIN_SUCCESS, {
      ...result.user,
      token: result.token,
    });
  } catch (error) {
    next(error);
  }
};

export const forgotPassword = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email } = req.body;
    const result = await authService.forgotPassword(email);
    sendSuccess(res, HTTP_STATUS.OK, result.message);
  } catch (error) {
    next(error);
  }
};

export const verifyOtp = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, otp } = req.body;
    const result = await authService.verifyOtp(email, otp);
    sendSuccess(res, HTTP_STATUS.OK, result.message);
  } catch (error) {
    next(error);
  }
};

export const resetPassword = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, newPassword } = req.body;
    const result = await authService.resetPassword(email, newPassword);
    sendSuccess(res, HTTP_STATUS.OK, result.message);
  } catch (error) {
    next(error);
  }
};
