import {
  CreateEventTransactionsReportType,
  EventTransactionsReportType,
  UpdateEventTransactionsReportType,
} from '../shared/types'
import { EventTransactionsReportSchema } from '../shared/schemas'
import { EventsTransactionsReportInterface } from '../repository/interface/eventsTransactionsReport.interface'

export class EventsCore {
  private pkTransaction: string
  private skTransaction: string
  constructor(private repository: EventsTransactionsReportInterface) {
    this.pkTransaction = ''
    this.skTransaction = ''
  }

  async create({ requestId, action, eventType, infoTransaction, reportName }: CreateEventTransactionsReportType) {
    console.info('init create Events service')
    const timestamp = Date.now()
    const ttl = ~~(timestamp / 1000 + 20 + 60)
    this.pkTransaction = `${reportName}#${timestamp}`
    this.skTransaction = `${action}#${requestId}`

    const event: EventTransactionsReportType = {
      eventType,
      infoTransaction,
      reportName,
      requestId: requestId,
      action,
      ttl,
      pk: this.pkTransaction,
      sk: this.skTransaction,
      dtCreated: new Date().toISOString(),
      dtUpdated: new Date().toISOString(),
    }

    console.info('create event ', action)

    const eventValidate = EventTransactionsReportSchema.parse(event)
    console.log('validate', eventValidate)
    await this.repository.create(eventValidate)
  }
  async update({ eventType }: UpdateEventTransactionsReportType) {
    console.info('init update Events service')

    console.info('update eventType ', eventType)

    await this.repository.update(this.pkTransaction, this.skTransaction, { eventType })
  }
}
