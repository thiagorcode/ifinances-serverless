import * as z from 'zod'
import { transactionsCategorySchema } from '../schemas'

export type TransactionsCategoryTypes = z.infer<typeof transactionsCategorySchema>
