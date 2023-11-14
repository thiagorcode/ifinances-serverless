import {
  CreateReportMonthlyType,
  FindReportMonthlyTypes,
  ReportsMonthlyTypes,
  TransactionsTypes,
} from '../../shared/types'

export default interface ReportsTransactionInterface {
  create(transaction: CreateReportMonthlyType): Promise<void>
  findAll(userId: string): Promise<TransactionsTypes[]>
  findByUserId(userId: string): Promise<TransactionsTypes[]>
  find(query: FindReportMonthlyTypes): Promise<ReportsMonthlyTypes | null>
}
