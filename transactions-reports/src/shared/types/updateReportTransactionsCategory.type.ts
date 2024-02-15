import * as z from 'zod'
import { updateReportTransactionsCategorySchema } from '../schemas'

export type UpdateReportTransactionsCategoryType = z.infer<typeof updateReportTransactionsCategorySchema>
