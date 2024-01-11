import { Callback } from 'aws-lambda'

import { EventStartType } from '../shared/types'
import { AppErrorException } from '../utils'
import { SendMessageTelegramCore } from '../core'
import { messages } from '../shared/constants/messages'

export const handler = async (event: EventStartType, callback: Callback) => {
  console.info('StartHandler')
  const sendMessageTelegramCore = new SendMessageTelegramCore(event.chatId)

  try {
    // criar um middleware que recebe todos esses envio de mensagens
    await sendMessageTelegramCore.execute(messages.firstAccess.init)

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
