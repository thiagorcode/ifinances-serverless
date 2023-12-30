import {
  ReportTransactionsMonthlyType,
  FindReportMonthlyTypes,
  ReportsMonthlyTypes,
  UpdateExpenseValueMonthlyType,
  UpdateRecipeValueMonthlyType,
  UpdateDecreaseValueReportsMonthlyType,
} from '../../shared/types'

export default interface ReportsTransactionMonthlyInterface {
  create(transaction: ReportTransactionsMonthlyType): Promise<void>
  findAll(userId: string): Promise<ReportTransactionsMonthlyType[]>
  findByUserId(userId: string): Promise<ReportTransactionsMonthlyType[]>
  find(query: FindReportMonthlyTypes): Promise<ReportsMonthlyTypes | null>
  updateExpenseValue(id: string, currentReport: UpdateExpenseValueMonthlyType): Promise<void>
  updateRecipeValue(id: string, currentReport: UpdateRecipeValueMonthlyType): Promise<void>
  updateDecreaseReportValue(id: string, currentReport: UpdateDecreaseValueReportsMonthlyType): Promise<void>
}
