import {
  CreateReportMonthlyType,
  FindReportMonthlyTypes,
  ReportsMonthlyTypes,
  TransactionsTypes,
  UpdateExpenseValueMonthlyType,
  UpdateRecipeValueMonthlyType,
} from '../../shared/types'

export default interface ReportsTransactionMonthlyInterface {
  create(transaction: CreateReportMonthlyType): Promise<void>
  findAll(userId: string): Promise<TransactionsTypes[]>
  findByUserId(userId: string): Promise<TransactionsTypes[]>
  find(query: FindReportMonthlyTypes): Promise<ReportsMonthlyTypes | null>
  updateExpenseValue(id: string, currentReport: UpdateExpenseValueMonthlyType): Promise<void>
  updateRecipeValue(id: string, currentReport: UpdateRecipeValueMonthlyType): Promise<void>
}
