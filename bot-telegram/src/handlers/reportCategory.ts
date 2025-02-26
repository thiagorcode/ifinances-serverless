import { Callback } from 'aws-lambda'

import { EventHandlerType } from '../shared/types'
import { AppErrorException } from '../utils'
import { ReportTransactionCategoryCore, SendMessageTelegramCore } from '../core'
import { messages } from '../shared/constants/messages'
import { ReportTransactionCategoryRepository } from '../repository/reportTransactionCategory.repository'

export const handler = async (event: EventHandlerType, callback: Callback) => {
  console.info('Event:', event)
  console.info('ReportCategoryHandler')

  const { chatId, attributes, user } = event
  // Repository
  const reportTransactionCategoryRepository = new ReportTransactionCategoryRepository()
  // Core
  const sendMessageTelegramCore = new SendMessageTelegramCore(chatId)

  try {
    const validateReportTransactionCategoryCore = new ReportTransactionCategoryCore(reportTransactionCategoryRepository)
    const messageReportCategory = await validateReportTransactionCategoryCore.execute(user.userId, attributes)
    await sendMessageTelegramCore.execute(messageReportCategory)
    return callback(null)
  } catch (error) {
    console.error(error)
    if (error instanceof AppErrorException) {
      await sendMessageTelegramCore.execute(error.message)

      return callback(null)
    }
    await sendMessageTelegramCore.execute(messages['1'])
    return callback(null)
  }
}
