import * as z from 'zod'
import { transactionsCardSchema } from '../schemas'

export type TransactionsTypes = z.infer<typeof transactionsCardSchema>
