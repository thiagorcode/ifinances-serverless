import { FindReportMonthlyQueryType } from '../shared/types'
import { ReportsTransactionMonthlyInterface } from '../repository/interface/reportsTransactionMonthly.interface'
import { AppErrorException } from '../utils'
import { findReportMonthlyQuerySchema } from '../shared/schemas'
import { HttpStatus } from '../enums'

export class FindReportMonthlyCore {
  private userId: string
  private yearMonth: string
  constructor(private repository: ReportsTransactionMonthlyInterface, query: FindReportMonthlyQueryType) {
    try {
      findReportMonthlyQuerySchema.parse(query)
      this.userId = query.userId
      this.yearMonth = query.yearMonth
    } catch (error) {
      console.error(error)
      throw new AppErrorException(HttpStatus.BAD_REQUEST, 'User ou data inválida')
    }
  }

  async execute() {
    console.info('init find Report service')
    return await this.repository.find({ yearMonth: this.yearMonth, userId: this.userId })
  }
}
