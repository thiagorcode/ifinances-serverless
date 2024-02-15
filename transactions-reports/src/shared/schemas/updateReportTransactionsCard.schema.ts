import * as z from 'zod'

export const updateReportTransactionsCardSchema = z.object({
  value: z.number(),
  quantityTransactions: z.number(),
})
