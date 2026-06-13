import { Router } from 'express';
import * as categoryController from '../controllers/category.controller';
import { validate } from '../middlewares/validate.middleware';
import {
  createCategorySchema,
  updateCategorySchema,
} from '../validations/category.validation';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router();

// ─── Public (read) ───────────────────────────────────────
router.get('/', categoryController.getAll);

// ─── Protected (write) ───────────────────────────────────
router.post('/', authMiddleware, validate(createCategorySchema), categoryController.create);
router.put('/:id', authMiddleware, validate(updateCategorySchema), categoryController.update);
router.delete('/:id', authMiddleware, categoryController.remove);

export default router;
