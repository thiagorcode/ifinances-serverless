import { z } from 'zod'

export const findReportMonthlyQuerySchema = z.object({
  userId: z.string().uuid(),
  yearMonth: z.string(),
})
