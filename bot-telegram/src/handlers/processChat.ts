import { destr } from 'destr'
import { APIGatewayProxyEvent, Callback, Context } from 'aws-lambda'

import { handler as CreateTransactionByChatHandler } from './createTransactionByChat'
import { handler as StartHandler } from './start'
import { handler as ReportMonthlyHandler } from './reportMonthly'
import { handler as ReportCardHandler } from './reportCard'
import { EventTelegramType } from '../shared/types'
import { extractTextFromEvent } from '../utils'
import { FindUserByBotUsernameCore, ProcessMessageCore, SendMessageTelegramCore, ValidateCore } from '../core'
import { UserRepository } from '../repository/user.repository'
import { messages } from '../shared/constants/messages'
import { commandsChat } from '../shared/constants/commandsChat'

export const handler = async (event: APIGatewayProxyEvent, _: Context, callback: Callback) => {
  console.info('Event:', event)
  console.info('Body:', event.body)

  const body = destr<EventTelegramType>(event.body)
  const { chatId, message } = extractTextFromEvent(body)
  const userRepository = new UserRepository()
  const findUserByBotUsernameCore = new FindUserByBotUsernameCore(userRepository)
  const sendMessageTelegramCore = new SendMessageTelegramCore(chatId)
  const user = await findUserByBotUsernameCore.execute(body.message.chat.username)
  const validateCore = new ValidateCore(event.headers, user)
  const { user: userValidated, message: validateMessage, isValidRequest } = await validateCore.execute()

  if (!isValidRequest || !userValidated) {
    await sendMessageTelegramCore.execute(validateMessage ?? 'Erro inesperado, tente novamente mais tarde!')
    return callback(null)
  }
  const processMessageCore = new ProcessMessageCore()
  const { cmd, attributes, errorMessage } = processMessageCore.execute({ message })
  if (errorMessage) {
    await sendMessageTelegramCore.execute(errorMessage)
    return callback(null)
  }

  switch (cmd) {
    case commandsChat.START:
      return await StartHandler({ chatId }, callback)
    case commandsChat.ADD_TRANSACTION_RECIPE:
      return await CreateTransactionByChatHandler({ attributes, chatId, user: userValidated, type: '+' }, callback)
    case commandsChat.ADD_TRANSACTION_EXPENSE:
      return await CreateTransactionByChatHandler({ attributes, chatId, user: userValidated, type: '-' }, callback)
    case commandsChat.SHOW_REPORT_MONTHLY:
      return await ReportMonthlyHandler({ attributes, chatId, user: userValidated }, callback)
    case commandsChat.SHOW_REPORT_CARD:
      return await ReportCardHandler({ attributes, chatId, user: userValidated }, callback)
    default:
      await sendMessageTelegramCore.execute(messages.commands.not_found)
      return callback(null)
  }
}
