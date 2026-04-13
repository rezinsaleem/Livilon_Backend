import { User } from '../models/user.model';
import { AppError } from '../utils/customError';
import { HTTP_STATUS } from '../constants/httpStatus';
import { MESSAGES } from '../constants/messages';
import { comparePassword, hashPassword } from '../utils/password.util';
import { generateToken } from '../utils/token.util';
import { generateOTP } from '../utils/otp.util';
import { sendOtpEmail } from './email.service';

export const loginUser = async (email: string, password: string) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw new AppError(MESSAGES.INVALID_CREDENTIALS, HTTP_STATUS.UNAUTHORIZED);
  }

  const isMatch = await comparePassword(password, user.password);
  if (!isMatch) {
    throw new AppError(MESSAGES.INVALID_CREDENTIALS, HTTP_STATUS.UNAUTHORIZED);
  }

  const token = generateToken({ id: user._id.toString(), email: user.email });

  return { token, user: { id: user._id, email: user.email, userId: user.userId } };
};

export const forgotPassword = async (email: string) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw new AppError(MESSAGES.USER_NOT_FOUND, HTTP_STATUS.NOT_FOUND);
  }

  const otp = generateOTP();
  const hashedOtp = await hashPassword(otp);

  user.otp = hashedOtp;
  user.otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
  user.isOtpVerified = false;
  await user.save();

  await sendOtpEmail(email, otp);

  return { message: MESSAGES.OTP_SENT };
};

export const verifyOtp = async (email: string, otp: string) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw new AppError(MESSAGES.USER_NOT_FOUND, HTTP_STATUS.NOT_FOUND);
  }

  if (!user.otp || !user.otpExpiry) {
    throw new AppError(MESSAGES.OTP_INVALID, HTTP_STATUS.BAD_REQUEST);
  }

  if (new Date() > user.otpExpiry) {
    // Clear expired OTP
    user.otp = undefined;
    user.otpExpiry = undefined;
    user.isOtpVerified = false;
    await user.save();
    throw new AppError(MESSAGES.OTP_INVALID, HTTP_STATUS.BAD_REQUEST);
  }

  const isMatch = await comparePassword(otp, user.otp);
  if (!isMatch) {
    throw new AppError(MESSAGES.OTP_INVALID, HTTP_STATUS.BAD_REQUEST);
  }

  // Mark OTP as verified but keep the record for reset-password step
  user.isOtpVerified = true;
  user.otp = undefined;
  user.otpExpiry = undefined;
  await user.save();

  return { message: MESSAGES.OTP_VERIFIED };
};

export const resetPassword = async (email: string, newPassword: string) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw new AppError(MESSAGES.USER_NOT_FOUND, HTTP_STATUS.NOT_FOUND);
  }

  if (!user.isOtpVerified) {
    throw new AppError(MESSAGES.OTP_NOT_VERIFIED, HTTP_STATUS.BAD_REQUEST);
  }

  user.password = await hashPassword(newPassword);
  user.isOtpVerified = false;
  await user.save();

  return { message: MESSAGES.PASSWORD_RESET_SUCCESS };
};
