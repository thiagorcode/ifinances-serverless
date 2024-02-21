import { z } from 'zod'

export const EventTypeEnum = z.enum([
  'IN_PROCESSING',
  'REPORT_CREATED',
  'ERROR_IN_CREATE',
  'UPDATE_IN_PROCESSING',
  'UPDATED',
  'ERROR_IN_UPDATE',
])

export const EventTransactionsReportSchema = z.object({
  requestId: z.string(),
  from: z.string(),
  eventType: EventTypeEnum,
  infoTransaction: z.any(),
  action: z.enum(['CREATE', 'UPDATE']),
  ttl: z.number(),
  pk: z.string(),
  sk: z.string(),
})
