import { randomUUID } from 'crypto'
import * as z from 'zod'

export const reportTransactionsCategorySchema = z.object({
  id: z.string().default(randomUUID()).optional(),
  value: z.number(),
  category: z.string(),
  yearMonth: z.string(),
  type: z.string(),
  year: z.string(),
  quantityTransactions: z.number(),
  userId: z.string(),
  dtCreated: z.string(),
  dtUpdated: z.string(),
})
