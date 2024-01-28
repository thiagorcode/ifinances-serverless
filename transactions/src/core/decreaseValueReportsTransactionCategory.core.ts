import {
  CreateTransactionsType,
  ReportTransactionsCategoryType,
  TransactionsTypes,
  UpdateDecreaseValueReportsCategoryType,
  UpdateReportTransactionsCategoryType,
} from '../shared/types'
import { randomUUID } from 'crypto'
import { ReportsTransactionsCategoryRepository } from '../repository/reportsTransactionsCategory.repository'
import { reportTransactionsCategorySchema } from '../shared/schemas'

export class DecreaseValueReportsTransactionCategoryCore {
  constructor(private repository: ReportsTransactionsCategoryRepository) {}

  async execute(transaction: TransactionsTypes) {
    console.info('init DecreaseValueReportsTransactionCategoryCore service')
    try {
      const reportCategory = await this.repository.find({
        yearMonth: transaction.yearMonth,
        userId: transaction.userId,
        categoryName: transaction.category.name,
      })
      console.info('reportCategory found', reportCategory)

      if (reportCategory?.id) {
        console.info('call update report category value')
        const updateReportCategory: UpdateDecreaseValueReportsCategoryType = {
          value: reportCategory.value - transaction.value,
          quantityTransactions: 1,
        }

        await this.repository.updateDecreaseReportValue(reportCategory.id, updateReportCategory)
        return
      }

      return
    } catch (error) {
      console.error(error)
      throw new Error(String(error))
    }
  }
}
