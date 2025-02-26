import {
  FindReportCategoryMonthlyTypes,
  FindReportCategoryTypes,
  ReportTransactionsCategoryType,
  UpdateReportTransactionsCategoryType,
} from '../../shared/types'

export default interface ReportsTransactionCategoryInterface {
  create(transaction: ReportTransactionsCategoryType): Promise<void>
  findAll(userId: string): Promise<ReportTransactionsCategoryType[]>
  findByMonth(query: FindReportCategoryMonthlyTypes): Promise<ReportTransactionsCategoryType[]>
  findByUserId(userId: string): Promise<ReportTransactionsCategoryType[]>
  find(query: FindReportCategoryTypes): Promise<ReportTransactionsCategoryType | null>
  updateReportValue(id: string, currentReport: UpdateReportTransactionsCategoryType): Promise<void>
}
