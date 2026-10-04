import { z } from 'zod';

export const getProductsQuerySchema = z.object({
  category: z.string().optional(),
  limit: z.coerce.number().int().positive().default(50).optional(),
  offset: z.coerce.number().int().nonnegative().default(0).optional(),
  search: z.string().optional(),
});

export const getProductParamsSchema = z.object({
  id: z.string().min(1),
});

export type GetProductsQuery = z.infer<typeof getProductsQuerySchema>;
export type GetProductParams = z.infer<typeof getProductParamsSchema>;
