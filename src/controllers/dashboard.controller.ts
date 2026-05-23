import { Request, Response, NextFunction } from 'express';
import * as dashboardService from '../services/dashboard.service';
import { sendSuccess } from '../utils/apiResponse.util';
import { HTTP_STATUS } from '../constants/httpStatus';
import { MESSAGES } from '../constants/messages';

export const overview = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await dashboardService.getOverview();
    sendSuccess(res, HTTP_STATUS.OK, MESSAGES.DASHBOARD_FETCHED, data);
  } catch (error) {
    next(error);
  }
};

export const monthlySales = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { year } = req.query as unknown as { year?: number };
    const data = await dashboardService.getMonthlySales(year);
    sendSuccess(res, HTTP_STATUS.OK, MESSAGES.DASHBOARD_FETCHED, data);
  } catch (error) {
    next(error);
  }
};

export const yearlySales = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await dashboardService.getYearlySales();
    sendSuccess(res, HTTP_STATUS.OK, MESSAGES.DASHBOARD_FETCHED, data);
  } catch (error) {
    next(error);
  }
};

export const topProducts = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { limit } = req.query as unknown as { limit?: number };
    const data = await dashboardService.getTopProducts(limit);
    sendSuccess(res, HTTP_STATUS.OK, MESSAGES.DASHBOARD_FETCHED, data);
  } catch (error) {
    next(error);
  }
};

export const exportCsv = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { startDate, endDate } = req.query as unknown as {
      startDate: Date;
      endDate: Date;
    };
    await dashboardService.exportSalesCsv(res, startDate, endDate);
  } catch (error) {
    next(error);
  }
};

export const exportPdf = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { startDate, endDate } = req.query as unknown as {
      startDate: Date;
      endDate: Date;
    };
    await dashboardService.exportSalesPdf(res, startDate, endDate);
  } catch (error) {
    next(error);
  }
};
