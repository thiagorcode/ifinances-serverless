import { DecreaseValueReportsTransactionCardCore } from '../core/decreaseValueReportsTransactionCard.core'
import { CreateReportsTransactionCardCore } from '../core/createReportsTransactionCard.core'
import { ReportsTransactionsCardRepository } from '../repository/reportsTransactionsCard.repository'
import { SendTransactionsReportsSQSType } from '../shared/types'
import { EventsTransactionsReportRepository } from '../repository/eventsTransactionsReport.repository'
import { EventsCore } from '../core/events.core'
import { EventTypeEnum } from '../shared/schemas'

export class MiddlewareCard {
  private body: SendTransactionsReportsSQSType
  private requestId: string
  private reportsTransactionsCardRepository: ReportsTransactionsCardRepository
  private createReportsTransactionCardCore: CreateReportsTransactionCardCore
  private decreaseValueReportsTransactionCardCore: DecreaseValueReportsTransactionCardCore
  private repositoryEvents: EventsTransactionsReportRepository
  private eventsCore: EventsCore
  private nameReport: string

  constructor(body: SendTransactionsReportsSQSType, requestId: string) {
    this.body = body
    this.requestId = requestId
    this.reportsTransactionsCardRepository = new ReportsTransactionsCardRepository()
    this.createReportsTransactionCardCore = new CreateReportsTransactionCardCore(this.reportsTransactionsCardRepository)
    this.decreaseValueReportsTransactionCardCore = new DecreaseValueReportsTransactionCardCore(
      this.reportsTransactionsCardRepository,
    )
    // Events
    this.repositoryEvents = new EventsTransactionsReportRepository()
    this.eventsCore = new EventsCore(this.repositoryEvents)
    this.nameReport = 'ReportCard'
  }

  private async remove() {
    try {
      await this.eventsCore.create({
        requestId: this.requestId,
        action: 'UPDATE',
        eventType: EventTypeEnum.enum.UPDATE_IN_PROCESSING,
        from: this.nameReport,
      })

      await this.decreaseValueReportsTransactionCardCore.execute(this.body.oldItem)

      await this.eventsCore.update({ eventType: EventTypeEnum.enum.UPDATED })
    } catch (error) {
      await this.eventsCore.update({ eventType: EventTypeEnum.enum.ERROR_IN_UPDATE })
    }
  }

  private async update() {
    try {
      await this.eventsCore.create({
        requestId: this.requestId,
        action: 'UPDATE',
        eventType: EventTypeEnum.enum.UPDATE_IN_PROCESSING,
        from: this.nameReport,
      })
      await this.decreaseValueReportsTransactionCardCore.execute(this.body.oldItem)
      await this.createReportsTransactionCardCore.execute(this.body.newItem)
      await this.eventsCore.update({ eventType: EventTypeEnum.enum.UPDATED })
    } catch (error) {
      await this.eventsCore.update({ eventType: EventTypeEnum.enum.ERROR_IN_UPDATE })
    }
  }

  private async create() {
    try {
      await this.eventsCore.create({
        requestId: this.requestId,
        action: 'UPDATE',
        eventType: EventTypeEnum.enum.IN_PROCESSING,
        from: this.nameReport,
      })
      await this.createReportsTransactionCardCore.execute(this.body.newItem)
      await this.eventsCore.update({ eventType: EventTypeEnum.enum.REPORT_CREATED })
    } catch (error) {
      await this.eventsCore.update({ eventType: EventTypeEnum.enum.ERROR_IN_CREATE })
    }
  }

  async execute() {
    if (this.body.eventType === 'REMOVE') {
      await this.remove()
    }

    if (this.body.eventType === 'MODIFY') {
      await this.update()
    }
    if (this.body.eventType === 'INSERT') {
      await this.create()
    }
  }
}
