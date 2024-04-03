import * as z from 'zod'
import { transactionsSchema } from '../schemas'

export type TransactionsTypes = z.infer<typeof transactionsSchema>
