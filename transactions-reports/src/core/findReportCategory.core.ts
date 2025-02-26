import { FindReportCategoryTypes } from '../shared/types'
import { AppErrorException } from '../utils'
import { findReportMonthlyQuerySchema } from '../shared/schemas'
import { HttpStatus } from '../enums'
import ReportsTransactionCategoryInterface from 'src/repository/interface/reportsTransactionCategory.interface'

export class FindReportCategoryCore {
  private userId: string
  private yearMonth: string
  constructor(private repository: ReportsTransactionCategoryInterface, query: Partial<FindReportCategoryTypes>) {
    try {
      findReportMonthlyQuerySchema.parse(query)
      this.userId = query.userId ?? ''
      this.yearMonth = query.yearMonth ?? ''
    } catch (error) {
      console.error(error)
      throw new AppErrorException(HttpStatus.BAD_REQUEST, 'User ou data inválida')
    }
  }

  async execute() {
    console.info('init find Report service')
    return await this.repository.findByMonth({ yearMonth: this.yearMonth, userId: this.userId })
  }
}
