import * as z from 'zod'
import { reportTransactionsCardSchema } from '../schemas'

export type ReportTransactionsCardType = z.infer<typeof reportTransactionsCardSchema>
