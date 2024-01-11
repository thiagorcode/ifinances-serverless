import { destr } from 'destr'
import { APIGatewayProxyEvent, Callback, Context } from 'aws-lambda'

import { handler as CreateTransactionByChatHandler } from './createTransactionByChat'
import { handler as StartHandler } from './start'
import { EventTelegramType } from '../shared/types'
import { extractTextFromEvent } from '../utils'
import { FindUserByBotUsernameCore, ProcessMessageCore, ValidateCore } from '../core'
import { CommandsChatEnum } from '../enums/commandsChat.enum'
import { UserRepository } from '../repository/user.repository'

export const handler = async (event: APIGatewayProxyEvent, context: Context, callback: Callback) => {
  console.info('Event:', event)
  console.info('Body:', event.body)
  const body = destr<EventTelegramType>(event.body)
  const { chatId, message } = extractTextFromEvent(body)
  const userRepository = new UserRepository()
  const findUserByBotUsernameCore = new FindUserByBotUsernameCore(userRepository)
  const user = await findUserByBotUsernameCore.execute(body.message.chat.username)
  const validateCore = new ValidateCore(event.headers, user, chatId)
  const { user: userValidated } = await validateCore.execute()

  const processMessageCore = new ProcessMessageCore()
  const { cmd, attributes } = processMessageCore.execute({ message })
  switch (cmd) {
    case CommandsChatEnum.START:
      return await StartHandler({ chatId }, callback)
    case CommandsChatEnum.ADD_TRANSACTION_RECIPE:
      return await CreateTransactionByChatHandler(
        { attributes, chatId, user: userValidated, type: '+' },
        context,
        callback,
      )
    case CommandsChatEnum.ADD_TRANSACTION_EXPENSE:
      return await CreateTransactionByChatHandler(
        { attributes, chatId, user: userValidated, type: '-' },
        context,
        callback,
      )
    default:
      return
  }
}
