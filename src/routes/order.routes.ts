import { Router } from 'express';
import * as orderController from '../controllers/order.controller';
import { validate } from '../middlewares/validate.middleware';
import {
  createOrderSchema,
  updateOrderSchema,
} from '../validations/order.validation';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router();

router.use(authMiddleware);

router.post('/', validate(createOrderSchema), orderController.create);
router.get('/', orderController.getAll);
router.get('/:id', orderController.getById);
router.put('/:id', validate(updateOrderSchema), orderController.update);
router.delete('/:id', orderController.remove);

export default router;
