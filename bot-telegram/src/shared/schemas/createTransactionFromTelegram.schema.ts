import * as z from 'zod'

export const createTransactionFromTelegramSchema = z.object({
  card: z.string(),
  date: z.string(),
  value: z.number().positive(),
  type: z.string(),
  userId: z.string().uuid(),
  category: z.string(),
  description: z.string().optional().default(''),
  originCreate: z.string().default('telegram'),
})
