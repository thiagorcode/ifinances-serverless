import { CreateTransactionsType, ReportTransactionsCardType, UpdateReportTransactionsCardType } from '../shared/types'
import { randomUUID } from 'crypto'
import { reportTransactionsCardSchema } from '../shared/schemas'
import { ReportsTransactionsCardRepository } from '../repository/reportsTransactionsCard.repository'
import { TransactionTypesEnum } from '../enums'

export class CreateReportsTransactionCardCore {
  constructor(private repository: ReportsTransactionsCardRepository) {}

  async execute(transaction: CreateTransactionsType) {
    console.info('init CreateReportsTransactionCategoryCore service')
    if (!transaction.card?.name || transaction.type === TransactionTypesEnum.RECIPE) return

    try {
      const reportCard = await this.repository.find({
        yearMonth: transaction.yearMonth,
        userId: transaction.userId,
        card: transaction.card.name,
      })
      console.info('reportCard found', reportCard)

      if (reportCard?.id) {
        console.info('call update report card')
        const totalValue = reportCard.value + transaction.value

        const updateReportCard: UpdateReportTransactionsCardType = {
          value: +totalValue.toFixed(2),
          quantityTransactions: reportCard.quantityTransactions + 1,
        }

        await this.repository.updateReportValue(reportCard.id, updateReportCard)
        return
      }

      console.info('create report card')
      const report: ReportTransactionsCardType = {
        id: randomUUID(),
        card: transaction.card.name,
        value: transaction.value,
        year: transaction.year,
        yearMonth: transaction.yearMonth,
        userId: transaction.userId,
        quantityTransactions: 1,
        dtCreated: new Date().toISOString(),
        dtUpdated: new Date().toISOString(),
      }
      const reportValidateSchema = reportTransactionsCardSchema.parse(report)
      console.log('validate', reportValidateSchema)
      await this.repository.create(reportValidateSchema)
      return
    } catch (error) {
      console.error(error)
      throw new Error(String(error))
    }
  }
}
