import { sendMessageToTelegram } from '../utils'

export class SendMessageTelegramCore {
  public chatId: string
  constructor(chatId: string) {
    this.chatId = chatId
  }
  async execute(message: string) {
    console.info('call SendMessageTelegramCore')
    return await sendMessageToTelegram(this.chatId, message)
  }
}
