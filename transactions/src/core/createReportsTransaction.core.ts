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
import { calculateNewExpenseValue, calculateNewRecipeValue, calculateNewTotalValue } from '../utils/calculateNewValues'
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
      console.debug('reportMonthly', { type, value })

      if (!reportMonthly) {
        // criar outro service para create
        console.info('create report')
        const report: CreateReportMonthlyType = {
          recipeValue: calculateNewRecipeValue(type, 0, value),
          expenseValue: calculateNewExpenseValue(type, 0, value),
          total: calculateNewTotalValue(type, 0, value),
          year: transaction.year,
          yearMonth: transaction.yearMonth,
          userId: transaction.userId,
        }
        const reportValidateSchema = createReportMonthlySchema.parse(report)
        console.log('validate', reportValidateSchema)
        await this.repository.create(reportValidateSchema)
        return
      }
      if (type === TransactionTypesEnum.RECIPE) {
        const updateReportMonthly: UpdateRecipeValueMonthlyType = {
          recipeValue: calculateNewRecipeValue(type, reportMonthly.recipeValue, value),
          total: calculateNewTotalValue(type, reportMonthly.total, value),
        }
        //TODO: Adiciona schema validate

        await this.repository.updateRecipeValue(reportMonthly.id, updateReportMonthly)
        return
      }

      if (type === TransactionTypesEnum.EXPENSE) {
        const updateReportMonthly: UpdateExpenseValueMonthlyType = {
          expenseValue: calculateNewExpenseValue(type, reportMonthly.recipeValue, value),
          total: calculateNewTotalValue(type, reportMonthly.total, value),
        }
        //TODO: Adicionar schema validate
        await this.repository.updateExpenseValue(reportMonthly.id, updateReportMonthly)
        return
      }
      console.log('sem retorno - ERROR')
      return
    } catch (error) {
      console.error(error)
      throw new Error(String(error))
    }
  }
}
