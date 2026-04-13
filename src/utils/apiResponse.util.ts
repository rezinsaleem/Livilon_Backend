import { Response } from 'express';
import { IApiResponse } from '../types';

export const sendSuccess = <T>(
  res: Response,
  statusCode: number,
  message: string,
  data?: T
): Response => {
  const response: IApiResponse<T> = {
    success: true,
    message,
    data,
  };
  return res.status(statusCode).json(response);
};

export const sendError = (
  res: Response,
  statusCode: number,
  message: string,
  data?: unknown
): Response => {
  const response: IApiResponse = {
    success: false,
    message,
    data,
  };
  return res.status(statusCode).json(response);
};
