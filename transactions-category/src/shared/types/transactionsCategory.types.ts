import * as z from 'zod'
import { TransactionsCategorySchema } from '../schemas'

export type TransactionsCategoryTypes = z.infer<typeof TransactionsCategorySchema>
