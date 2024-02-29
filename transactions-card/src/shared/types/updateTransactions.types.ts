import * as z from 'zod'
import { transactionsCardSchema } from '../schemas'

export type UpdateTransactionsCardType = z.infer<typeof transactionsCardSchema>
