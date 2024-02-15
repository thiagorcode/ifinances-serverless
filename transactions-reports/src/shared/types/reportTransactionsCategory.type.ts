import * as z from 'zod'
import { reportTransactionsCategorySchema } from '../schemas'

export type ReportTransactionsCategoryType = z.infer<typeof reportTransactionsCategorySchema>
