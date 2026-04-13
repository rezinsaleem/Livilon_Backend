import { Request, Response, NextFunction } from 'express';
import * as productService from '../services/product.service';
import { sendSuccess } from '../utils/apiResponse.util';
import { HTTP_STATUS } from '../constants/httpStatus';
import { MESSAGES } from '../constants/messages';

export const create = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const product = await productService.createProduct(req.body);
    sendSuccess(res, HTTP_STATUS.CREATED, MESSAGES.PRODUCT_CREATED, product);
  } catch (error) {
    next(error);
  }
};

export const getAll = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { searchKey, page, limit } = req.query;
    const result = await productService.getProducts(
      searchKey as string,
      page ? parseInt(page as string, 10) : 1,
      limit ? parseInt(limit as string, 10) : 10
    );
    sendSuccess(res, HTTP_STATUS.OK, MESSAGES.PRODUCT_FETCHED, result);
  } catch (error) {
    next(error);
  }
};

export const getById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const product = await productService.getProductById(req.params.id);
    sendSuccess(res, HTTP_STATUS.OK, MESSAGES.PRODUCT_FETCHED, product);
  } catch (error) {
    next(error);
  }
};

export const update = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const product = await productService.updateProduct(req.params.id, req.body);
    sendSuccess(res, HTTP_STATUS.OK, MESSAGES.PRODUCT_UPDATED, product);
  } catch (error) {
    next(error);
  }
};

export const remove = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await productService.deleteProduct(req.params.id);
    sendSuccess(res, HTTP_STATUS.OK, MESSAGES.PRODUCT_DELETED);
  } catch (error) {
    next(error);
  }
};
