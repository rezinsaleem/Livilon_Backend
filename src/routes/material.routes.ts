import { Router } from 'express';
import * as materialController from '../controllers/material.controller';
import { validate } from '../middlewares/validate.middleware';
import {
  createMaterialSchema,
  updateMaterialSchema,
} from '../validations/material.validation';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router();

router.use(authMiddleware);

router.get('/categories', materialController.getCategories);
router.post('/', validate(createMaterialSchema), materialController.create);
router.get('/', materialController.getAll);
router.put('/:id', validate(updateMaterialSchema), materialController.update);
router.delete('/:id', materialController.remove);

export default router;
