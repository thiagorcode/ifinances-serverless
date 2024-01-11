import {
  CreateTransactionsType,
  ReportTransactionsCategoryType,
  UpdateReportTransactionsCategoryType,
} from '../shared/types'
import { randomUUID } from 'crypto'
import { ReportsTransactionsCategoryRepository } from '../repository/reportsTransactionsCategory.repository'
import { reportTransactionsCategorySchema } from '../shared/schemas'

export class CreateReportsTransactionCategoryCore {
  constructor(private repository: ReportsTransactionsCategoryRepository) {}

  async execute(transaction: CreateTransactionsType) {
    console.info('init CreateReportsTransactionCategoryCore service')
    try {
      const reportMonthly = await this.repository.find({
        yearMonth: transaction.yearMonth,
        userId: transaction.userId,
        categoryName: transaction.category.name,
      })
      console.info('reportCategory found', reportMonthly)

      if (reportMonthly?.id) {
        console.info('reportcategory - update')
        const totalValue = reportMonthly.value + transaction.value
        const updateReportCard: UpdateReportTransactionsCategoryType = {
          value: +totalValue.toFixed(2),
          quantityTransactions: reportMonthly.quantityTransactions + 1,
        }

        await this.repository.updateReportValue(reportMonthly.id, updateReportCard)
        return
      }

      // criar outro service para create
      console.info('create report category')
      const report: ReportTransactionsCategoryType = {
        id: randomUUID(),
        category: transaction.category.name,
        value: transaction.value,
        year: transaction.year,
        type: transaction.type,
        yearMonth: transaction.yearMonth,
        userId: transaction.userId,
        quantityTransactions: 1,
        dtCreated: new Date().toISOString(),
        dtUpdated: new Date().toISOString(),
      }
      const reportValidateSchema = reportTransactionsCategorySchema.parse(report)
      console.log('validate', reportValidateSchema)
      await this.repository.create(reportValidateSchema)
      return
    } catch (error) {
      console.error(error)
      throw new Error(String(error))
    }
  }
}
