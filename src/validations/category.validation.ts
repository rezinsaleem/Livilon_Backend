import { z } from 'zod';

export const createCategorySchema = z.object({
  name: z.string().min(1, 'Category name is required').trim(),
  image: z.string().min(1, 'Image key is required').trim(),
});

export const updateCategorySchema = z.object({
  name: z.string().min(1, 'Category name is required').trim().optional(),
  image: z.string().min(1, 'Image key is required').trim().optional(),
});
