import { SendTransactionsReportsEventType } from '../shared/types'
import { EventsTransactionsReportRepository } from '../repository/eventsTransactionsReport.repository'
import { EventsCore } from '../core/events.core'
import { EventTypeEnum } from '../shared/schemas'
import { ReportsTransactionsMonthlyRepository } from '../repository/reportsTransactionsMonthly.repository'
import { CreateReportsTransactionMonthlyCore } from '../core/createReportsTransactionMonthly.core'
import { DecreaseValueReportsTransactionMonthlyCore } from '../core/decreaseValueReportsTransactionMonthly.core'

export class MiddlewareMonthly {
  private body: SendTransactionsReportsEventType
  private requestId: string
  private reportsTransactionsMonthlyRepository: ReportsTransactionsMonthlyRepository
  private createReportsTransactionMonthlyCore: CreateReportsTransactionMonthlyCore
  private decreaseValueReportsTransactionCardCore: DecreaseValueReportsTransactionMonthlyCore
  private repositoryEvents: EventsTransactionsReportRepository
  private eventsCore: EventsCore
  private reportName: string

  constructor(body: SendTransactionsReportsEventType, requestId: string, reportName: string) {
    this.body = body
    this.requestId = requestId
    this.reportsTransactionsMonthlyRepository = new ReportsTransactionsMonthlyRepository()
    this.createReportsTransactionMonthlyCore = new CreateReportsTransactionMonthlyCore(
      this.reportsTransactionsMonthlyRepository,
    )
    this.decreaseValueReportsTransactionCardCore = new DecreaseValueReportsTransactionMonthlyCore(
      this.reportsTransactionsMonthlyRepository,
    )
    // Events
    this.repositoryEvents = new EventsTransactionsReportRepository()
    this.eventsCore = new EventsCore(this.repositoryEvents)
    this.reportName = reportName
  }

  private async remove() {
    try {
      await this.eventsCore.create({
        requestId: this.requestId,
        action: 'UPDATE',
        eventType: EventTypeEnum.enum.UPDATE_IN_PROCESSING,
        reportName: this.reportName,
        infoTransaction: {
          value: this.body.oldItem.value,
          yearMonth: this.body.oldItem.yearMonth,
          id: this.body.oldItem.id,
        },
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
        reportName: this.reportName,
        infoTransaction: {
          newValue: this.body.newItem.value,
          newYearMonth: this.body.newItem.yearMonth,
          newType: this.body.newItem.type,
          value: this.body.oldItem.value,
          yearMonth: this.body.oldItem.yearMonth,
          type: this.body.oldItem.type,
          id: this.body.oldItem.id,
        },
      })
      await this.decreaseValueReportsTransactionCardCore.execute(this.body.oldItem)
      await this.createReportsTransactionMonthlyCore.execute(this.body.newItem)
      await this.eventsCore.update({ eventType: EventTypeEnum.enum.UPDATED })
    } catch (error) {
      await this.eventsCore.update({ eventType: EventTypeEnum.enum.ERROR_IN_UPDATE })
    }
  }

  private async create() {
    try {
      await this.eventsCore.create({
        requestId: this.requestId,
        action: 'CREATE',
        eventType: EventTypeEnum.enum.IN_PROCESSING,
        reportName: this.reportName,
        infoTransaction: {
          value: this.body.newItem.value,
          yearMonth: this.body.newItem.yearMonth,
          id: this.body.newItem.id,
        },
      })
      await this.createReportsTransactionMonthlyCore.execute(this.body.newItem)
      await this.eventsCore.update({ eventType: EventTypeEnum.enum.REPORT_CREATED })
    } catch (error) {
      await this.eventsCore.update({ eventType: EventTypeEnum.enum.ERROR_IN_CREATE })
    }
  }

  async execute() {
    console.info('---- START MIDDLEWARE ---', this.body.eventType)
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
