import { AppErrorException } from '../utils'
import { messages } from '../shared/constants/messages'
import { listMonth } from '../shared/constants/listMonths'
import { ReportTransactionMonthlyRepositoryInterface } from '../repository/interface/reportTransactionMonthly.interface'

export class ReportTransactionMonthlyCore {
  constructor(private reportTransactionMonthlyRepository: ReportTransactionMonthlyRepositoryInterface) {}

  async execute(userId: string, attributes: string[]) {
    console.info('call validateReportTransactionMonthly core')
    const isNotMonthValid = !listMonth.find((month) => month.monthNumber === attributes[0])

    if (attributes.length < 2) {
      throw new AppErrorException(1, messages.reportsMonthly.invalid_command)
    }

    if (isNotMonthValid) {
      throw new AppErrorException(1, messages.reportsMonthly.invalid_month)
    }
    const yearMonth = `${attributes[0]}-${attributes[1]}`

    // TODO: Adicionar um schema validate
    console.debug('filter', { yearMonth, userId })
    const report = await this.reportTransactionMonthlyRepository.find(yearMonth, userId)
    if (!report) {
      return messages.reportsMonthly.not_found
    }

    return `Segue os dados do relatório - ${yearMonth}\n \n
    Entrada: ${report.recipeValue}\n
    Despesas: ${report.expenseValue} \n
    Total: ${report.total}
    Quantidade de transações: ${report.quantityTransactions}
    `
  }
}
