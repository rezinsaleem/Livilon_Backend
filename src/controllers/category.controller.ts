import { Request, Response, NextFunction } from 'express';
import * as categoryService from '../services/category.service';
import { sendSuccess } from '../utils/apiResponse.util';
import { HTTP_STATUS } from '../constants/httpStatus';
import { MESSAGES } from '../constants/messages';

export const create = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const category = await categoryService.createCategory(req.body);
    sendSuccess(res, HTTP_STATUS.CREATED, MESSAGES.CATEGORY_CREATED, category);
  } catch (error) {
    next(error);
  }
};

export const getAll = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { searchKey } = req.query;
    const categories = await categoryService.getCategories(searchKey as string);
    sendSuccess(res, HTTP_STATUS.OK, MESSAGES.CATEGORY_FETCHED, categories);
  } catch (error) {
    next(error);
  }
};

export const update = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const category = await categoryService.updateCategory(req.params.id, req.body);
    sendSuccess(res, HTTP_STATUS.OK, MESSAGES.CATEGORY_UPDATED, category);
  } catch (error) {
    next(error);
  }
};

export const remove = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await categoryService.deleteCategory(req.params.id);
    sendSuccess(res, HTTP_STATUS.OK, MESSAGES.CATEGORY_DELETED);
  } catch (error) {
    next(error);
  }
};
