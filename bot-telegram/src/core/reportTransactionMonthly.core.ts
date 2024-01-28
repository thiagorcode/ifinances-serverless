import { formatCurrencyPtBr } from './../utils/formatCurrency'
import { AppErrorException } from '../utils'
import { messages } from '../shared/constants/messages'
import { listMonth } from '../shared/constants/listMonths'
import { ReportTransactionMonthlyRepositoryInterface } from '../repository/interface/reportTransactionMonthly.interface'

export class ReportTransactionMonthlyCore {
  constructor(private reportTransactionMonthlyRepository: ReportTransactionMonthlyRepositoryInterface) {}

  async execute(userId: string, attributes: string[]) {
    console.info('call validateReportTransactionMonthly core')
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
    const report = await this.reportTransactionMonthlyRepository.find(yearMonth, userId)
    if (!report) {
      return messages.reportsMonthly.not_found
    }

    return `Segue os dados do relatório - ${monthDescription.month} - ${year}\n \nReceita: ${formatCurrencyPtBr(
      report.recipeValue,
    )}\nDespesas: ${formatCurrencyPtBr(report.expenseValue)} \nTotal: ${formatCurrencyPtBr(
      report.total,
    )}\nQuantidade de transações: ${report.quantityTransactions}`
  }
}
