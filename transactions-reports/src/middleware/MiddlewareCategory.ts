import { SendTransactionsReportsSQSType } from '../shared/types'
import { EventsTransactionsReportRepository } from '../repository/eventsTransactionsReport.repository'
import { EventsCore } from '../core/events.core'
import { EventTypeEnum } from '../shared/schemas'
import { ReportsTransactionsCategoryRepository } from '../repository/reportsTransactionsCategory.repository'
import { DecreaseValueReportsTransactionCategoryCore } from '../core/decreaseValueReportsTransactionCategory.core'
import { CreateReportsTransactionCategoryCore } from '../core/createReportsTransactionCategory.core'

export class MiddlewareCategory {
  private body: SendTransactionsReportsSQSType
  private requestId: string
  private categoryRepository: ReportsTransactionsCategoryRepository
  private createReportsTransactionCategoryCore: CreateReportsTransactionCategoryCore
  private decreaseValueReportsTransactionCategoryCore: DecreaseValueReportsTransactionCategoryCore
  private repositoryEvents: EventsTransactionsReportRepository
  private eventsCore: EventsCore
  private nameReport: string

  constructor(body: SendTransactionsReportsSQSType, requestId: string) {
    this.body = body
    this.requestId = requestId
    this.categoryRepository = new ReportsTransactionsCategoryRepository()
    this.createReportsTransactionCategoryCore = new CreateReportsTransactionCategoryCore(this.categoryRepository)
    this.decreaseValueReportsTransactionCategoryCore = new DecreaseValueReportsTransactionCategoryCore(
      this.categoryRepository,
    )
    // Events
    this.repositoryEvents = new EventsTransactionsReportRepository()
    this.eventsCore = new EventsCore(this.repositoryEvents)
    this.nameReport = 'ReportCategory'
  }

  private async remove() {
    try {
      await this.eventsCore.create({
        requestId: this.requestId,
        action: 'UPDATE',
        eventType: EventTypeEnum.enum.UPDATE_IN_PROCESSING,
        from: this.nameReport,
      })

      await this.decreaseValueReportsTransactionCategoryCore.execute(this.body.oldItem)

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
      await this.decreaseValueReportsTransactionCategoryCore.execute(this.body.oldItem)
      await this.createReportsTransactionCategoryCore.execute(this.body.newItem)
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
      await this.createReportsTransactionCategoryCore.execute(this.body.newItem)
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
