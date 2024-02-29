import * as z from 'zod'

export const TransactionsCategorySchema = z.object({
  id: z.string(),
  name: z.string(),
  icon: z.string(),
  type: z.string(),
  dtCreated: z.string().default(new Date().toISOString()),
  dtUpdated: z.string().default(new Date().toISOString()),
})
