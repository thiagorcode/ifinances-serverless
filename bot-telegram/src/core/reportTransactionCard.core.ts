import { ReportTransactionCardRepositoryInterface } from '../repository/interface/reportTransactionCard.interface'
import { formatCurrencyPtBr } from '../utils/formatCurrency'
import { AppErrorException } from '../utils'
import { messages } from '../shared/constants/messages'
import { listMonth } from '../shared/constants/listMonths'

export class ReportTransactionCardCore {
  constructor(private reportTransactionCardRepository: ReportTransactionCardRepositoryInterface) {}

  async execute(userId: string, attributes: string[]) {
    console.info('call validateReportTransactionMonthly core')
    const month = attributes[0]
    const year = attributes[1]
    const monthDescription = listMonth.find((lMonth) => lMonth.monthNumber === month)

    if (attributes.length < 2) {
      throw new AppErrorException(1, messages.reportCard.invalid_command)
    }

    if (!monthDescription) {
      throw new AppErrorException(1, messages.reportCard.invalid_month)
    }
    const yearMonth = `${year}-${month}`

    // TODO: Adicionar um schema validate
    console.debug('filter', { yearMonth, userId })
    const report = await this.reportTransactionCardRepository.find(yearMonth, userId)
    if (!report) {
      return messages.reportCard.not_found
    }

    let messageResponse = `Segue os dados do relatório - ${monthDescription.month} - ${year}\n \n`
    report.forEach((r) => {
      messageResponse += `${r.card}: ${formatCurrencyPtBr(r.value)} - Qtd. Tra.: ${r.quantityTransactions}\n`
    })
    return messageResponse
  }
}
