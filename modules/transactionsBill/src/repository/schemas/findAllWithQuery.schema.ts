import { z } from 'zod';

const booleanStringSchema = z
  .string()
  .refine((value) => {
    // Verifica se o valor é "true" ou "false"
    return value === 'true' || value === 'false';
  })
  .transform((value) => {
    // Converte a string para um booleano
    return value === 'true';
  });

export const findAllWithQuerySchema = z.object({
  userId: z.string().uuid(),
  categoryId: z.string().optional(),
  date: z.string().optional(),
  type: z.string().optional(),
  isPaid: booleanStringSchema.optional(),
});
