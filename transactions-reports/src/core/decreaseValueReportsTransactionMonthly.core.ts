import { TransactionsTypes, UpdateDecreaseValueReportsMonthlyType } from '../shared/types'
import { ReportsTransactionsMonthlyRepository } from '../repository/reportsTransactionsMonthly.repository'
import { calculateDecreaseValueReport } from '../utils/calculateNewValues'
import { TransactionTypesEnum } from '../enums'

export class DecreaseValueReportsTransactionMonthlyCore {
  constructor(private repository: ReportsTransactionsMonthlyRepository) {}

  async execute(oldTransaction: TransactionsTypes) {
    console.info('init DecreaseValueReportsTransactionMonthlyCore service')
    try {
      const reportMonthly = await this.repository.find({
        yearMonth: oldTransaction.yearMonth,
        userId: oldTransaction.userId,
      })
      console.debug('reportMonthly found', reportMonthly)

      if (reportMonthly) {
        console.info('update report Monthly')
        const valuesReport = calculateDecreaseValueReport({
          type: oldTransaction.type as TransactionTypesEnum,
          transactionValue: oldTransaction.value,
          currentReportTotal: reportMonthly.total,
          currentReportRecipeValue: reportMonthly.recipeValue,
          currentReportExpenseValue: reportMonthly.expenseValue,
        })
        const updateReportMonthly: UpdateDecreaseValueReportsMonthlyType = {
          recipeValue: valuesReport.recipe,
          expenseValue: valuesReport.expense,
          total: valuesReport.total,
          quantityTransactions: reportMonthly.quantityTransactions - 1,
        }
        await this.repository.updateDecreaseReportValue(reportMonthly.id, updateReportMonthly)
        console.info('update success')
        return
      }

      return
    } catch (error) {
      console.error(error)
      throw new Error(String(error))
    }
  }
}
