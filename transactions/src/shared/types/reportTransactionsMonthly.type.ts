import * as z from 'zod'
import { reportTransactionsMonthlySchema } from '../schemas'

export type ReportTransactionsMonthlyType = z.infer<typeof reportTransactionsMonthlySchema>
