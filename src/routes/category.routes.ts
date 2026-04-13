import { Router } from 'express';
import * as categoryController from '../controllers/category.controller';
import { validate } from '../middlewares/validate.middleware';
import {
  createCategorySchema,
  updateCategorySchema,
} from '../validations/category.validation';
// import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router();

// router.use(authMiddleware);

router.post('/', validate(createCategorySchema), categoryController.create);
router.get('/', categoryController.getAll);
router.put('/:id', validate(updateCategorySchema), categoryController.update);
router.delete('/:id', categoryController.remove);

export default router;
