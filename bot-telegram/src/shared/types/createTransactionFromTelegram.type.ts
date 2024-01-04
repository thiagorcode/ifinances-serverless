import { createTransactionFromTelegramSchema } from './../schemas/createTransactionFromTelegram.schema'
import * as z from 'zod'

export type CreateTransactionFromTelegramType = z.infer<typeof createTransactionFromTelegramSchema>
