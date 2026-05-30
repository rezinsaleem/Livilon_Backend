import { z } from 'zod';
import { MATERIAL_CATEGORIES } from '../constants/materialCategories';

const materialCategorySchema = z
  .enum(MATERIAL_CATEGORIES, {
    errorMap: () => ({
      message: `materialCategory must be one of: ${MATERIAL_CATEGORIES.join(', ')}`,
    }),
  })
  .nullable()
  .optional();

export const createMaterialSchema = z.object({
  materialId: z.string().min(1, 'Material ID is required').trim(),
  name: z.string().min(1, 'Material name is required').trim(),
  price: z.number().min(0, 'Price must be a non-negative number'),
  materialCategory: materialCategorySchema,
});

export const updateMaterialSchema = z.object({
  materialId: z.string().min(1, 'Material ID is required').trim().optional(),
  name: z.string().min(1, 'Material name is required').trim().optional(),
  price: z.number().min(0, 'Price must be a non-negative number').optional(),
  materialCategory: materialCategorySchema,
});
