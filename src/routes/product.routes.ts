import { Router } from 'express';
import * as productController from '../controllers/product.controller';
import { validate } from '../middlewares/validate.middleware';
import {
  createProductSchema,
  updateProductSchema,
} from '../validations/product.validation';
// import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router();

// router.use(authMiddleware);

router.post('/', validate(createProductSchema), productController.create);
router.get('/', productController.getAll);
router.get('/:id', productController.getById);
router.put('/:id', validate(updateProductSchema), productController.update);
router.delete('/:id', productController.remove);

export default router;
