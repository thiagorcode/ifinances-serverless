import { ReportTransactionMonthlyType } from '../../shared/types'

export interface ReportTransactionMonthlyRepositoryInterface {
  find(yearMonth: string, userId: string): Promise<ReportTransactionMonthlyType | null>
}
