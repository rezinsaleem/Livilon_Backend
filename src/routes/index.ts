import { Router } from 'express';
import authRoutes from './auth.routes';
import categoryRoutes from './category.routes';
import materialRoutes from './material.routes';
import productRoutes from './product.routes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/categories', categoryRoutes);
router.use('/materials', materialRoutes);
router.use('/products', productRoutes);

export default router;
