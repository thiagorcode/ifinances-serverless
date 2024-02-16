import { Callback } from 'aws-lambda'

import { EventReportMonthlyType } from '../shared/types'
import { AppErrorException } from '../utils'
import { SendMessageTelegramCore, ReportTransactionMonthlyCore } from '../core'
import { messages } from '../shared/constants/messages'
import { ReportTransactionMonthlyRepository } from '../repository/reportTransactionMonthly.repository'

export const handler = async (event: EventReportMonthlyType, callback: Callback) => {
  console.info('Event:', event)
  console.info('ReportMonthlyHandler')

  const { chatId, attributes, user } = event
  // Repository
  const reportTransactionMonthlyRepository = new ReportTransactionMonthlyRepository()
  // Core
  const sendMessageTelegramCore = new SendMessageTelegramCore(chatId)

  try {
    const validateReportTransactionMonthlyCore = new ReportTransactionMonthlyCore(reportTransactionMonthlyRepository)
    const messageReportMonthly = await validateReportTransactionMonthlyCore.execute(user.userId, attributes)
    await sendMessageTelegramCore.execute(messageReportMonthly)
    return callback(null)
  } catch (error) {
    if (error instanceof AppErrorException) {
      await sendMessageTelegramCore.execute(error.message)

      return callback(null)
    }
    await sendMessageTelegramCore.execute(messages['1'])
    return callback(null)
  }
}
