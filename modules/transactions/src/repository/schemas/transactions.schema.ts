import * as z from 'zod';

export const transactionsSchema = z
  .object({
    id: z.string().optional(),
    description: z.string().optional().default(''),
    value: z.number().positive(),
    categoryId: z.string().uuid(),
    date: z.string(),
    originCreate: z.string().optional().default('web'),
    finalInstallment: z.number().max(30).optional().default(0),
    installment: z.number().optional().default(0),
    isPaid: z.boolean(),
    type: z.string(),
    specification: z.string().optional().default(''),
    bank: z.string().optional().default(''),
    userId: z.string().uuid(),
    dtCreated: z.string().default(new Date().toISOString()),
    dtUpdated: z.string().default(new Date().toISOString()),
  })
  .transform((data) => ({
    ...data,
    year: new Date(data.date).getFullYear().toString(),
    yearMonth: new Date(data.date).toISOString().slice(0, 7),
  }));
