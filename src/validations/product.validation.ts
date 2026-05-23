import { z } from 'zod';

const materialListItemSchema = z.object({
  materialId: z.string().min(1, 'Material ID is required'),
  name: z.string().min(1, 'Material name is required'),
  price: z.number().min(0, 'Price must be non-negative'),
  quantity: z.number().min(1, 'Quantity must be at least 1'),
  totalPrice: z.number().min(0, 'Total price must be non-negative'),
});

const productCategorySchema = z.object({
  _id: z.string().min(1, 'Category ID is required'),
  name: z.string().min(1, 'Category name is required'),
});

export const createProductSchema = z.object({
  modelNo: z.string().min(1, 'Model number is required').trim(),
  name: z.string().min(1, 'Product name is required').trim(),
  images: z.array(z.string()).default([]),
  mrp: z.number().min(0, 'MRP must be a non-negative number'),
  materialList: z.array(materialListItemSchema).default([]),
  totalBuildCost: z.number().min(0).optional(),
  category: productCategorySchema,
});

export const updateProductSchema = z.object({
  modelNo: z.string().min(1).trim().optional(),
  name: z.string().min(1).trim().optional(),
  images: z.array(z.string()).optional(),
  mrp: z.number().min(0).optional(),
  materialList: z.array(materialListItemSchema).optional(),
  totalBuildCost: z.number().min(0).optional(),
  category: productCategorySchema.optional(),
});
