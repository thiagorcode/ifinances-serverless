import { EventBridgeEvent } from 'aws-lambda'

import { SendMessageTelegramCore } from '../core'
import { EventSendMessageBot } from '../shared/types'

export const handler = async (event: EventBridgeEvent<'SEND_MESSAGE_BOT', EventSendMessageBot>) => {
  console.info('SEND MESSAGE BOT')
  console.info('EVENT :: ', JSON.stringify(event.detail))
  const sendMessageTelegramCore = new SendMessageTelegramCore(event.detail.chatId)
  await sendMessageTelegramCore.execute(event.detail.message)
}
