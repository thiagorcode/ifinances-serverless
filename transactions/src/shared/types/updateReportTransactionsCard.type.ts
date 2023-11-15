import * as z from 'zod'
import { updateReportTransactionsCategorySchema } from '../schemas'

export type UpdateReportTransactionsCardType = z.infer<typeof updateReportTransactionsCategorySchema>
