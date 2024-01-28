import * as z from 'zod'

const cardValidate = z.object({
  id: z.string().uuid(),
  name: z.string(),
})

const categoryValidate = z.object({
  id: z.string().uuid(),
  name: z.string(),
})

export const createTransactionFromTelegramSchema = z.object({
  card: cardValidate.optional(),
  category: categoryValidate,
  date: z.date(),
  value: z.union([z.string(), z.number().positive()]).transform((val) => {
    if (typeof val === 'string') {
      // Tenta converter a string para um número
      const parsedValue = parseFloat(val.replace(',', '.'))
      if (!isNaN(parsedValue)) {
        return parsedValue
      }
    }
    // Se não for possível converter para número, retorna o valor original
    return val
  }),
  type: z.string(),
  userId: z.string().uuid(),
  description: z.string().optional().default(''),
  originCreate: z.string().default('telegram'),
})
