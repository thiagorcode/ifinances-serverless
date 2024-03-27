import { ReportTransactionCategoryType } from '../../shared/types'

export interface ReportTransactionCategoryRepositoryInterface {
  find(yearMonth: string, userId: string): Promise<ReportTransactionCategoryType[]>
}
