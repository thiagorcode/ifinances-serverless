import * as z from 'zod'
import { findReportMonthlyQuerySchema } from '../schemas'

export type FindReportMonthlyQueryType = z.infer<typeof findReportMonthlyQuerySchema>
