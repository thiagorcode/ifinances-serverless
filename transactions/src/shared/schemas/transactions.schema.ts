import * as z from 'zod'

const cardValidate = z.object({
  id: z.string().uuid(),
  name: z.string(),
})

const categoryValidate = z.object({
  id: z.string().uuid(),
  name: z.string(),
})

export const transactionsSchema = z
  .object({
    id: z.string().uuid().optional(),
    description: z.string().optional().default(''),
    value: z.number().positive(),
    date: z.string(),
    originCreate: z.string().optional().default(''),
    businessName: z.string().optional().default(''),
    currentInstallment: z.number().default(0),
    finalInstallments: z.number().max(30).default(0),
    isInstallments: z.boolean().default(false),
    isPaid: z.boolean().default(false),
    isDeleted: z.boolean().default(false),
    type: z.string(),
    expenseType: z.string().optional().default(''),
    category: categoryValidate,
    card: cardValidate.optional().nullable(),
    userId: z.string().uuid(),
    dtCreated: z.string().default(new Date().toISOString()),
    dtUpdated: z.string().default(new Date().toISOString()),
  })
  .transform((data) => ({
    ...data,
    year: new Date(data.date).getFullYear().toString(),
    yearMonth: new Date(data.date).toISOString().slice(0, 7),
  }))
