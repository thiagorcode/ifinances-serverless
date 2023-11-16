import * as z from 'zod'

export const transactionsCategorySchema = z.object({
  id: z.string(),
  name: z.string(),
  icon: z.string(),
  type: z.string(),
  dtCreated: z.string().default(new Date().toISOString()),
  dtUpdated: z.string().default(new Date().toISOString()),
})
