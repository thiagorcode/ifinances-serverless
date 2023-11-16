import * as z from 'zod'
import { updateReportTransactionsCardSchema } from '../schemas'

export type UpdateReportTransactionsCardType = z.infer<typeof updateReportTransactionsCardSchema>
