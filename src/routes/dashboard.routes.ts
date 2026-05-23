import { Router } from 'express';
import * as dashboardController from '../controllers/dashboard.controller';
import { validate } from '../middlewares/validate.middleware';
import {
  monthlyQuerySchema,
  topProductsQuerySchema,
  dateRangeQuerySchema,
} from '../validations/dashboard.validation';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router();

router.use(authMiddleware);

router.get('/overview', dashboardController.overview);
router.get(
  '/sales/monthly',
  validate(monthlyQuerySchema, 'query'),
  dashboardController.monthlySales
);
router.get('/sales/yearly', dashboardController.yearlySales);
router.get(
  '/top-products',
  validate(topProductsQuerySchema, 'query'),
  dashboardController.topProducts
);
router.get(
  '/reports/csv',
  validate(dateRangeQuerySchema, 'query'),
  dashboardController.exportCsv
);
router.get(
  '/reports/pdf',
  validate(dateRangeQuerySchema, 'query'),
  dashboardController.exportPdf
);

export default router;
