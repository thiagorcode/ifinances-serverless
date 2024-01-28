import { ReportTransactionCardType } from '../../shared/types'

export interface ReportTransactionCardRepositoryInterface {
  find(yearMonth: string, userId: string): Promise<ReportTransactionCardType[] | null>
}
