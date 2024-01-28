import { EventTelegramType } from '../shared/types'

export const extractTextFromEvent = (eventMessage: EventTelegramType): { chatId: string; message: string } => {
  let message = ''
  if (eventMessage.channel_post?.text) {
    message = eventMessage.channel_post.text
  } else if (eventMessage.message?.text) {
    message = eventMessage.message.text
  }
  let chatId = ''
  if (eventMessage.message?.chat && eventMessage.message.chat.id) {
    chatId = eventMessage.message.chat.id
  } else if (eventMessage.channel_post?.chat && eventMessage.channel_post.chat.id) {
    chatId = eventMessage.channel_post.chat.id
  }

  return {
    chatId,
    message,
  }
}
