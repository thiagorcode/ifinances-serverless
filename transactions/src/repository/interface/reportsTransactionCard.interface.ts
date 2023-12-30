import {
  FindReportCardTypes,
  ReportTransactionsCardType,
  UpdateDecreaseValueReportsCardType,
  UpdateReportTransactionsCardType,
} from '../../shared/types'

export default interface ReportsTransactionCardInterface {
  create(transaction: ReportTransactionsCardType): Promise<void>
  findAll(userId: string): Promise<ReportTransactionsCardType[]>
  findByUserId(userId: string): Promise<ReportTransactionsCardType[]>
  find(query: FindReportCardTypes): Promise<ReportTransactionsCardType | null>
  updateReportValue(id: string, currentReport: UpdateReportTransactionsCardType): Promise<void>
  updateDecreaseReportValue(id: string, currentReport: UpdateDecreaseValueReportsCardType): Promise<void>
}
