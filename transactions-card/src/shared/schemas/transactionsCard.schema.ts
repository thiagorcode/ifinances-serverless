import * as z from 'zod'
import { randomUUID } from 'crypto'

export const transactionsCardSchema = z.object({
  id: z.string().default(randomUUID()),
  name: z.string().optional().default(''),
  invoiceDueDate: z.string().optional().default(''),
  limitValue: z.number().positive(),
  cardNumber: z.string().optional().default(''),
  userId: z.string().uuid(),
  dtCreated: z.string().default(new Date().toISOString()),
  dtUpdated: z.string().default(new Date().toISOString()),
})
