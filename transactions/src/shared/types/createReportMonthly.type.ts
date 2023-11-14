import * as z from 'zod'
import { createReportMonthlySchema } from '../schemas'

export type CreateReportMonthlyType = z.infer<typeof createReportMonthlySchema>
