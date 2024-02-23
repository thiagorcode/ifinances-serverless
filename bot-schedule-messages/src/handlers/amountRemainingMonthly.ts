import { UserBotRepository } from '../repository/userBot.repository'
import { SendAmountRemainingMonthlyCore } from '../core'
import { ReportTransactionMonthlyRepository } from '../repository/reportTransactionMonthly.repository'

export const handler = async () => {
  const userBotRepository = new UserBotRepository()
  const reportTransactionsMonthlyRepository = new ReportTransactionMonthlyRepository()
  const processImportDataCore = new SendAmountRemainingMonthlyCore(
    userBotRepository,
    reportTransactionsMonthlyRepository,
  )

  await processImportDataCore.execute()
}
