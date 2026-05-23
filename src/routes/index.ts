import { Router } from 'express';
import authRoutes from './auth.routes';
import categoryRoutes from './category.routes';
import materialRoutes from './material.routes';
import productRoutes from './product.routes';
import orderRoutes from './order.routes';
import dashboardRoutes from './dashboard.routes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/categories', categoryRoutes);
router.use('/materials', materialRoutes);
router.use('/products', productRoutes);
router.use('/orders', orderRoutes);
router.use('/dashboard', dashboardRoutes);

export default router;
