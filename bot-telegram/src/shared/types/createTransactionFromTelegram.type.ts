import { createTransactionFromTelegramSchema } from './../schemas/createTransactionFromTelegram.schema'
import * as z from 'zod'

export type CreateTransactionTelegramType = {
  date: string
  categoryName: string
  cardName: string | null
  value: string
  description: string
  userId: string
  type: string
  originCreate: string
}

export type CreateTransactionFromTelegramType = z.infer<typeof createTransactionFromTelegramSchema>
