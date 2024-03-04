import { DecreaseValueReportsTransactionCardCore } from '../core/decreaseValueReportsTransactionCard.core'
import { CreateReportsTransactionCardCore } from '../core/createReportsTransactionCard.core'
import { ReportsTransactionsCardRepository } from '../repository/reportsTransactionsCard.repository'
import { SendTransactionsReportsEventType } from '../shared/types'
import { EventsTransactionsReportRepository } from '../repository/eventsTransactionsReport.repository'
import { EventsCore } from '../core/events.core'
import { EventTypeEnum } from '../shared/schemas'

export class MiddlewareCard {
  private body: SendTransactionsReportsEventType
  private requestId: string
  private reportsTransactionsCardRepository: ReportsTransactionsCardRepository
  private createReportsTransactionCardCore: CreateReportsTransactionCardCore
  private decreaseValueReportsTransactionCardCore: DecreaseValueReportsTransactionCardCore
  private repositoryEvents: EventsTransactionsReportRepository
  private eventsCore: EventsCore
  private reportName: string

  constructor(body: SendTransactionsReportsEventType, requestId: string, reportName: string) {
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
    this.reportName = reportName
  }
  // TODO: Salvar info transaction apenas quando houver algum erro
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
          card: this.body.oldItem.card,
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
          newCard: this.body.newItem.card,
          value: this.body.oldItem.value,
          yearMonth: this.body.oldItem.yearMonth,
          card: this.body.oldItem.card,
          type: this.body.oldItem.type,
          id: this.body.oldItem.id,
        },
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
        action: 'CREATE',
        eventType: EventTypeEnum.enum.IN_PROCESSING,
        reportName: this.reportName,
        infoTransaction: {
          value: this.body.newItem.value,
          yearMonth: this.body.newItem.yearMonth,
          card: this.body.newItem.card,
          id: this.body.newItem.id,
        },
      })
      await this.createReportsTransactionCardCore.execute(this.body.newItem)
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
    if (this.body.eventType === 'INSERT' && this.body.newItem.card?.id) {
      await this.create()
    }
  }
}
