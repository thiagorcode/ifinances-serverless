import { randomUUID } from 'crypto'
import * as z from 'zod'

export const reportTransactionsCardSchema = z.object({
  id: z.string().default(randomUUID()).optional(),
  value: z.number(),
  card: z.string(),
  yearMonth: z.string(),
  goal: z.number().default(0),
  quantityTransactions: z.number(),
  year: z.string(),
  userId: z.string(),
  dtCreated: z.string().default(new Date().toISOString()).optional(),
  dtUpdated: z.string().default(new Date().toISOString()).optional(),
})
