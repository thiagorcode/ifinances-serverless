import { UserBotRepository } from '../repository/userBot.repository'
import { SendAmountRemainingMonthlyCore } from '../core'
import { ReportTransactionMonthlyRepository } from '../repository/reportTransactionMonthly.repository'
import { EventBridgeRepository } from '../repository/eventBridge.repository'

export const handler = async () => {
  const userBotRepository = new UserBotRepository()
  const reportTransactionsMonthlyRepository = new ReportTransactionMonthlyRepository()
  const eventBridgeRepository = new EventBridgeRepository()
  const sendAmountRemainingMonthlyCore = new SendAmountRemainingMonthlyCore(
    userBotRepository,
    reportTransactionsMonthlyRepository,
    eventBridgeRepository,
  )

  await sendAmountRemainingMonthlyCore.execute()
}
