import { z } from 'zod';

const materialTypeSchema = z.object({
  materialType: z.string().min(1, 'materialType is required').trim(),
  price: z.number().min(0, 'Price must be a non-negative number'),
});

// Ensures the materialType names within a single material are unique
// (case-insensitive). No duplicate type entries on the same material.
const addDuplicateTypeIssues = (
  materialTypes: { materialType: string }[] | undefined,
  ctx: z.RefinementCtx
) => {
  if (!materialTypes || materialTypes.length < 2) return;
  const seen = new Set<string>();
  materialTypes.forEach((item, index) => {
    const key = item.materialType.trim().toLowerCase();
    if (seen.has(key)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['materialTypes', index, 'materialType'],
        message: 'materialType names must be unique within a material',
      });
    }
    seen.add(key);
  });
};

export const createMaterialSchema = z
  .object({
    materialCode: z.string().min(1, 'Material code is required').trim(),
    materialName: z.string().min(1, 'Material name is required').trim(),
    hasMultipleTypes: z.boolean(),
    price: z.number().min(0, 'Price must be a non-negative number').optional(),
    materialTypes: z.array(materialTypeSchema).optional(),
  })
  .superRefine((data, ctx) => {
    if (data.hasMultipleTypes) {
      if (data.price !== undefined) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['price'],
          message: 'price must not be provided when hasMultipleTypes is true',
        });
      }
      if (!data.materialTypes || data.materialTypes.length === 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['materialTypes'],
          message:
            'materialTypes is required and must contain at least one item when hasMultipleTypes is true',
        });
      }
    } else {
      if (data.price === undefined) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['price'],
          message: 'price is required when hasMultipleTypes is false',
        });
      }
      if (data.materialTypes !== undefined) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['materialTypes'],
          message: 'materialTypes must not be provided when hasMultipleTypes is false',
        });
      }
    }

    addDuplicateTypeIssues(data.materialTypes, ctx);
  });

export const updateMaterialSchema = z
  .object({
    materialCode: z.string().min(1, 'Material code is required').trim().optional(),
    materialName: z.string().min(1, 'Material name is required').trim().optional(),
    hasMultipleTypes: z.boolean().optional(),
    price: z.number().min(0, 'Price must be a non-negative number').optional(),
    materialTypes: z.array(materialTypeSchema).optional(),
  })
  .superRefine((data, ctx) => {
    if (data.hasMultipleTypes === true) {
      if (data.price !== undefined) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['price'],
          message: 'price must not be provided when hasMultipleTypes is true',
        });
      }
      if (!data.materialTypes || data.materialTypes.length === 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['materialTypes'],
          message:
            'materialTypes is required and must contain at least one item when hasMultipleTypes is true',
        });
      }
    } else if (data.hasMultipleTypes === false) {
      if (data.price === undefined) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['price'],
          message: 'price is required when hasMultipleTypes is false',
        });
      }
      if (data.materialTypes !== undefined) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['materialTypes'],
          message: 'materialTypes must not be provided when hasMultipleTypes is false',
        });
      }
    } else if (data.price !== undefined && data.materialTypes !== undefined) {
      // hasMultipleTypes not supplied in this update
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['materialTypes'],
        message:
          'Provide either price or materialTypes, not both, unless hasMultipleTypes is specified',
      });
    }

    addDuplicateTypeIssues(data.materialTypes, ctx);
  });
