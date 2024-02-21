import { EventTransactionsReportType, UpdateEventTransactionsReportType } from '../../shared/types'

export interface EventsTransactionsReportInterface {
  create(event: EventTransactionsReportType): Promise<void>
  update(id: string, data: UpdateEventTransactionsReportType): Promise<void>
}
