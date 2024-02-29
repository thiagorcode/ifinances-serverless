import { EventTransactionsReportType, UpdateEventTransactionsReportType } from '../../shared/types'

export interface EventsTransactionsReportInterface {
  create(event: EventTransactionsReportType): Promise<void>
  update(pk: string, sk: string, data: UpdateEventTransactionsReportType): Promise<void>
}
