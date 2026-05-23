import { Request, Response, NextFunction } from 'express';
import * as orderService from '../services/order.service';
import { sendSuccess } from '../utils/apiResponse.util';
import { HTTP_STATUS } from '../constants/httpStatus';
import { MESSAGES } from '../constants/messages';

export const create = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const order = await orderService.createOrder(req.body);
    sendSuccess(res, HTTP_STATUS.CREATED, MESSAGES.ORDER_CREATED, order);
  } catch (error) {
    next(error);
  }
};

export const getAll = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { searchKey, page, limit } = req.query;
    const result = await orderService.getOrders(
      searchKey as string,
      page ? parseInt(page as string, 10) : 1,
      limit ? parseInt(limit as string, 10) : 10
    );
    sendSuccess(res, HTTP_STATUS.OK, MESSAGES.ORDER_FETCHED, result);
  } catch (error) {
    next(error);
  }
};

export const getById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const order = await orderService.getOrderById(req.params.id);
    sendSuccess(res, HTTP_STATUS.OK, MESSAGES.ORDER_FETCHED, order);
  } catch (error) {
    next(error);
  }
};

export const update = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const order = await orderService.updateOrder(req.params.id, req.body);
    sendSuccess(res, HTTP_STATUS.OK, MESSAGES.ORDER_UPDATED, order);
  } catch (error) {
    next(error);
  }
};

export const remove = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await orderService.deleteOrder(req.params.id);
    sendSuccess(res, HTTP_STATUS.OK, MESSAGES.ORDER_DELETED);
  } catch (error) {
    next(error);
  }
};
