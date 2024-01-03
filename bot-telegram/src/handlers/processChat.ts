import { destr } from 'destr'
import { APIGatewayProxyEvent, Callback, Context } from 'aws-lambda'
import { EventTelegramType } from '../shared/types'
import { UserRepository } from '../repository/user.repository'
import { extractTextFromEvent } from '../utils'
import { FindUserByBotUsernameCore, ProcessMessageCore, SendMessageTelegramCore } from '../core'
import { errorMessages } from '../shared/messages/error'

export const handler = async (event: APIGatewayProxyEvent, context: Context, callback: Callback) => {
  console.info('Event:', event)
  const body = destr<EventTelegramType>(event.body)
  console.info('Body:', body)
  const { chatId, message } = extractTextFromEvent(body)
  // Repository
  const userRepository = new UserRepository()

  // Core
  const sendMessageTelegramCore = new SendMessageTelegramCore(chatId)
  const findUserByBotUsernameCore = new FindUserByBotUsernameCore(userRepository)
  const processMessageCore = new ProcessMessageCore()

  try {
    const user = await findUserByBotUsernameCore.execute(body.message.chat.username)
    console.info('user', user)
    await processMessageCore.execute({
      message,
      sendMessageTelegramCore,
      user,
    })
    callback(null)
  } catch (error) {
    await sendMessageTelegramCore.execute(errorMessages['1'])
    callback('invalid')
  }
}
