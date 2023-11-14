import { randomUUID } from 'crypto'
import * as z from 'zod'

export const createReportMonthlySchema = z.object({
  id: z.string().default(randomUUID()).optional(),
  recipeValue: z.number(),
  expenseValue: z.number(),
  total: z.number(),
  year: z.string(),
  yearMonth: z.string(),
  userId: z.string(),
  dtCreated: z.string().default(new Date().toISOString()).optional(),
  dtUpdated: z.string().default(new Date().toISOString()).optional(),
})
