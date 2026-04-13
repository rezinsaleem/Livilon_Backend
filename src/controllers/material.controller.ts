import { Request, Response, NextFunction } from 'express';
import * as materialService from '../services/material.service';
import { sendSuccess } from '../utils/apiResponse.util';
import { HTTP_STATUS } from '../constants/httpStatus';
import { MESSAGES } from '../constants/messages';

export const create = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const material = await materialService.createMaterial(req.body);
    sendSuccess(res, HTTP_STATUS.CREATED, MESSAGES.MATERIAL_CREATED, material);
  } catch (error) {
    next(error);
  }
};

export const getAll = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { searchKey } = req.query;
    const materials = await materialService.getMaterials(searchKey as string);
    sendSuccess(res, HTTP_STATUS.OK, MESSAGES.MATERIAL_FETCHED, materials);
  } catch (error) {
    next(error);
  }
};

export const update = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const material = await materialService.updateMaterial(req.params.id, req.body);
    sendSuccess(res, HTTP_STATUS.OK, MESSAGES.MATERIAL_UPDATED, material);
  } catch (error) {
    next(error);
  }
};

export const remove = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await materialService.deleteMaterial(req.params.id);
    sendSuccess(res, HTTP_STATUS.OK, MESSAGES.MATERIAL_DELETED);
  } catch (error) {
    next(error);
  }
};
