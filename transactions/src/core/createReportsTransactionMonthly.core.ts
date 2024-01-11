import { randomUUID } from 'crypto'
import { CreateTransactionsType, UpdateExpenseValueMonthlyType, UpdateRecipeValueMonthlyType } from '../shared/types'
import { reportTransactionsMonthlySchema } from '../shared/schemas'
import { ReportsTransactionsMonthlyRepository } from '../repository/reportsTransactionsMonthly.repository'
import { calculateNewValueReport, calculateUpdateValueReport } from '../utils/calculateNewValues'
import { TransactionTypesEnum } from '../enums'

export class CreateReportsTransactionMonthlyCore {
  constructor(private repository: ReportsTransactionsMonthlyRepository) {}

  async execute(transaction: CreateTransactionsType) {
    console.info('init CreateReportsTransactionCore service')
    try {
      const reportMonthly = await this.repository.find({
        year: transaction.year,
        yearMonth: transaction.yearMonth,
        userId: transaction.userId,
      })
      const { type, value } = transaction
      console.debug('reportMonthly found', reportMonthly)

      if (!reportMonthly) {
        // criar outro service para create
        console.info('create report')
        const valuesReport = calculateNewValueReport(type, value)
        const report = {
          id: randomUUID(),
          recipeValue: valuesReport.recipe,
          expenseValue: valuesReport.expense,
          total: valuesReport.total,
          userId: transaction.userId,
          year: transaction.year,
          yearMonth: transaction.yearMonth,
          quantityTransactions: 1,
        }
        const reportValidateSchema = reportTransactionsMonthlySchema.parse(report)
        console.log('validate', reportValidateSchema)
        await this.repository.create(reportValidateSchema)
        return
      }
      // TODO: Refatorar esse trecho, para não ter duas funções de atualização
      if (type === TransactionTypesEnum.RECIPE) {
        console.info('call updateRecipeValue')
        const valuesReport = calculateUpdateValueReport(type, value, reportMonthly.recipeValue, reportMonthly.total)

        const updateReportMonthly: UpdateRecipeValueMonthlyType = {
          recipeValue: valuesReport.recipe,
          total: valuesReport.total,
          quantityTransactions: reportMonthly.quantityTransactions + 1,
          yearMonth: reportMonthly.yearMonth,
        }
        //TODO: Adiciona schema validate

        await this.repository.updateRecipeValue(reportMonthly.id, updateReportMonthly)
        return
      }

      if (type === TransactionTypesEnum.EXPENSE) {
        console.info('call updateExpenseValue')

        const valuesReport = calculateUpdateValueReport(type, value, reportMonthly.expenseValue, reportMonthly.total)

        const updateReportMonthly: UpdateExpenseValueMonthlyType = {
          expenseValue: valuesReport.expense,
          total: valuesReport.total,
          quantityTransactions: reportMonthly.quantityTransactions + 1,
          yearMonth: reportMonthly.yearMonth,
        }
        //TODO: Adicionar schema validate
        await this.repository.updateExpenseValue(reportMonthly.id, updateReportMonthly)
        return
      }
      console.info('sem retorno de ERRO')
      return
    } catch (error) {
      console.error(error)
      throw new Error(String(error))
    }
  }
}
