import { Callback, Context } from 'aws-lambda'

import { EventReportMonthlyType } from '../shared/types'
import { AppErrorException } from '../utils'
import { SendMessageTelegramCore } from '../core'
import { messages } from '../shared/constants/messages'
import { ReportTransactionCardRepository } from '../repository/reportTransactionCard.repository'
import { ReportTransactionCardCore } from '../core/reportTransactionCard.core'

export const handler = async (event: EventReportMonthlyType, context: Context, callback: Callback) => {
  console.info('Event:', event)
  console.info('ReportCardHandler')

  const { chatId, attributes, user } = event
  // Repository
  const reportTransactionCardRepository = new ReportTransactionCardRepository()
  // Core
  const sendMessageTelegramCore = new SendMessageTelegramCore(chatId)

  try {
    const validateReportTransactionCardCore = new ReportTransactionCardCore(reportTransactionCardRepository)
    const messageReportMonthly = await validateReportTransactionCardCore.execute(user.userId, attributes)
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
