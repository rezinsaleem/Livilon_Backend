import { z } from 'zod';

export const createOrderSchema = z.object({
  referenceImages: z.array(z.string()).default([]),
  productId: z.string().min(1, 'Product ID is required'),
  clientName: z.string().trim().min(1, 'Client name cannot be empty').optional(),
  soldPrice: z.number().min(0, 'Sold price must be a non-negative number'),
});

export const updateOrderSchema = z.object({
  referenceImages: z.array(z.string()).optional(),
  productId: z.string().min(1).optional(),
  clientName: z.string().trim().min(1).optional(),
  soldPrice: z.number().min(0).optional(),
});
