import { z } from 'zod';

export const createMaterialSchema = z.object({
  materialId: z.string().min(1, 'Material ID is required').trim(),
  name: z.string().min(1, 'Material name is required').trim(),
  price: z.number().min(0, 'Price must be a non-negative number'),
});

export const updateMaterialSchema = z.object({
  materialId: z.string().min(1, 'Material ID is required').trim().optional(),
  name: z.string().min(1, 'Material name is required').trim().optional(),
  price: z.number().min(0, 'Price must be a non-negative number').optional(),
});
