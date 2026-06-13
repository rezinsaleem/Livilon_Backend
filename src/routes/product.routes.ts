import { Router } from 'express';
import * as productController from '../controllers/product.controller';
import { validate } from '../middlewares/validate.middleware';
import {
  createProductSchema,
  updateProductSchema,
} from '../validations/product.validation';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router();

// ─── Public (read) ───────────────────────────────────────
router.get('/', productController.getAll);
router.get('/:id', productController.getById);
router.get('/:id/reference-images', productController.getReferenceImages);

// ─── Protected (write) ───────────────────────────────────
router.post('/', authMiddleware, validate(createProductSchema), productController.create);
router.put('/:id', authMiddleware, validate(updateProductSchema), productController.update);
router.delete('/:id', authMiddleware, productController.remove);

export default router;
