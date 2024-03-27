import { formatCurrencyPtBr } from '../utils/formatCurrency'
import { AppErrorException } from '../utils'
import { messages } from '../shared/constants/messages'
import { listMonth } from '../shared/constants/listMonths'
import { ReportTransactionCategoryRepositoryInterface } from '../repository/interface/reportTransactionCategory.interface'

export class ReportTransactionCategoryCore {
  constructor(private reportTransactionCategoryRepository: ReportTransactionCategoryRepositoryInterface) {}

  async execute(userId: string, attributes: string[]) {
    console.info('call validateReportTransactionCategory core')
    const month = attributes[0]
    const year = attributes[1]
    const monthDescription = listMonth.find((lMonth) => lMonth.monthNumber === month)

    if (attributes.length < 2) {
      throw new AppErrorException(1, messages.reportsMonthly.invalid_command)
    }

    if (!monthDescription) {
      throw new AppErrorException(1, messages.reportsMonthly.invalid_month)
    }
    const yearMonth = `${year}-${month}`

    // TODO: Adicionar um schema validate
    console.debug('filter', { yearMonth, userId })
    const report = await this.reportTransactionCategoryRepository.find(yearMonth, userId)
    if (!report.length) {
      return messages.reportsMonthly.not_found
    }

    let messageInit = `Segue os dados do relatório - ${monthDescription.month} - ${year}\n \n`

    report.forEach((currentReport) => {
      if (currentReport.type === '-')
        messageInit += `${currentReport.category}: ${formatCurrencyPtBr(currentReport.value)}\n`
    })

    return messageInit
  }
}
