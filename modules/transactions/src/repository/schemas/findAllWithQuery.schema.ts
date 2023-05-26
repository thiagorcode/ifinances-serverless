import * as z from 'zod';

export const findAllWithQuerySchema = z.object({
  userId: z.string().optional(),
  categoryId: z.string().optional(),
  date: z.string().optional(),
  type: z.string().optional(),
  isPaid: z.boolean().optional(),
});
