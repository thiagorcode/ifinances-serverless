import {
  CreateReportMonthlyType,
  CreateTransactionsType,
  UpdateExpenseValueMonthlyType,
  UpdateRecipeValueMonthlyType,
} from '../shared/types'
import { AppErrorException } from '../utils'
import { createReportMonthlySchema, transactionsSchema } from '../shared/schemas'
import { randomUUID } from 'crypto'
import { addMonths, parseISO } from 'date-fns'
import { SQSRepository } from '../repository/sqs.repository'
import { ReportsTransactionsRepository } from '../repository/reportsTransactions.repository'
import { calculateNewValueReport, calculateUpdateValueReport } from '../utils/calculateNewValues'
import { TransactionTypesEnum } from '../enums'

export class CreateReportsTransactionCore {
  constructor(private repository: ReportsTransactionsRepository) {}

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
        const report: CreateReportMonthlyType = {
          recipeValue: valuesReport.recipe,
          expenseValue: valuesReport.expense,
          total: valuesReport.total,
          year: transaction.year,
          yearMonth: transaction.yearMonth,
          userId: transaction.userId,
        }
        const reportValidateSchema = createReportMonthlySchema.parse(report)
        console.log('validate', reportValidateSchema)
        await this.repository.create(reportValidateSchema)
        return
      }
      // TODO: Refatorar esse trecho, para não ter duas funções de atualização
      if (type === TransactionTypesEnum.RECIPE) {
        const valuesReport = calculateUpdateValueReport(type, value, reportMonthly.recipeValue, reportMonthly.total)

        const updateReportMonthly: UpdateRecipeValueMonthlyType = {
          recipeValue: valuesReport.recipe,
          total: valuesReport.total,
        }
        //TODO: Adiciona schema validate

        await this.repository.updateRecipeValue(reportMonthly.id, updateReportMonthly)
        return
      }

      if (type === TransactionTypesEnum.EXPENSE) {
        const valuesReport = calculateUpdateValueReport(type, value, reportMonthly.expenseValue, reportMonthly.total)

        const updateReportMonthly: UpdateExpenseValueMonthlyType = {
          expenseValue: valuesReport.expense,
          total: valuesReport.total,
        }
        //TODO: Adicionar schema validate
        await this.repository.updateExpenseValue(reportMonthly.id, updateReportMonthly)
        return
      }
      console.info('sem retorno - ERROR')
      return
    } catch (error) {
      console.error(error)
      throw new Error(String(error))
    }
  }
}
