import * as z from 'zod'

export const updateReportTransactionsCategorySchema = z.object({
  value: z.number(),
  quantityTransactions: z.number(),
})
