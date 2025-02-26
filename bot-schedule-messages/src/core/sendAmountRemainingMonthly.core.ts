import { EventSendMessageBot } from '../shared/types'
import { EventBridgeRepositoryInterface } from '../repository/interface/eventBridgeRepository.interface'
import { ReportTransactionMonthlyRepositoryInterface } from '../repository/interface/reportTransactionMonthly.interface'
import { UserBotRepositoryInterface } from '../repository/interface/userBotRepository.interface'
import { defineMessageReportMonthly, formatDateDefaultReport } from '../utils'

export class SendAmountRemainingMonthlyCore {
  constructor(
    private userBotRepository: UserBotRepositoryInterface,
    private reportMonthlyRepository: ReportTransactionMonthlyRepositoryInterface,
    private eventBridgeRepository: EventBridgeRepositoryInterface,
  ) {}

  async execute(): Promise<void> {
    console.info('call SendAmountRemainingMonthlyCore')
    const users = await this.userBotRepository.findAllUsers()

    const currentDate = new Date()
    const nextMonthDate = new Date(new Date().setMonth(currentDate.getMonth() + 1))
    const currentMonthYear = currentDate.toLocaleDateString('pt-BR', {
      year: 'numeric',
      month: '2-digit',
    })

    const nextMonthYear = nextMonthDate.toLocaleDateString('pt-BR', {
      year: 'numeric',
      month: '2-digit',
    })

    console.info('MONTH QUERY', currentMonthYear, nextMonthYear)
    const sendReportUsers = users.map(async (user) => {
      const reportCurrentMonthly = await this.reportMonthlyRepository.find(
        formatDateDefaultReport(currentMonthYear),
        user.userId,
      )
      const reportNextMonthly = await this.reportMonthlyRepository.find(
        formatDateDefaultReport(nextMonthYear),
        user.userId,
      )
      console.log('CURRENT REPORT', !!reportCurrentMonthly)
      const messageReport = defineMessageReportMonthly({
        currentMonthYear,
        nextMonthYear,
        currentReport: reportCurrentMonthly,
        nextMonthReport: reportNextMonthly,
      })

      if (messageReport) {
        await this.eventBridgeRepository.push<EventSendMessageBot>(
          { chatId: user.chatId, message: messageReport },
          'lambda.send-message',
          process.env.BUS_TRANSACTIONS_NAME ?? '',
          'SEND_MESSAGE_BOT',
        )
      }
    })
    await Promise.all(sendReportUsers)
  }
}
