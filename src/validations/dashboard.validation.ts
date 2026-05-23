import { z } from 'zod';

export const monthlyQuerySchema = z.object({
  year: z.coerce.number().int().min(2000).max(2100).optional(),
});

export const topProductsQuerySchema = z.object({
  limit: z.coerce.number().int().min(1).max(100).optional(),
});

export const dateRangeQuerySchema = z
  .object({
    startDate: z.coerce.date({
      required_error: 'startDate is required',
      invalid_type_error: 'startDate must be a valid date',
    }),
    endDate: z.coerce.date({
      required_error: 'endDate is required',
      invalid_type_error: 'endDate must be a valid date',
    }),
  })
  .refine((d) => d.startDate <= d.endDate, {
    message: 'startDate must be before or equal to endDate',
    path: ['startDate'],
  });
