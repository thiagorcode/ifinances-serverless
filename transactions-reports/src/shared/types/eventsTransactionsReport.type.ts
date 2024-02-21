import * as z from 'zod'
import { EventTransactionsReportSchema, EventTypeEnum } from '../schemas'

export type EventTransactionsReportType = z.infer<typeof EventTransactionsReportSchema>

export type CreateEventTransactionsReportType = {
  requestId: string
  eventType: z.infer<typeof EventTypeEnum>
  action: 'CREATE' | 'UPDATE'
  infoTransaction?: any
  from: string
}

export type UpdateEventTransactionsReportType = {
  eventType: z.infer<typeof EventTypeEnum>
}
