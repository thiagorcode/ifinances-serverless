import { sendMessageToTelegram } from '../utils/sendMessageTelegram'
import { EventTelegramType } from '../shared/types'
import { parseCommand } from '../utils/parseCommand'
import { extractTextFromEvent } from '../utils'

export class ProcessMessageCore {
  async execute(eventMessage: EventTelegramType) {
    console.info('call ProcessMessage')

    const { chatId, message } = extractTextFromEvent(eventMessage)
    try {
      if (!message) throw new Error('Invalid Command')
      const messageCommands = parseCommand(message)
      await sendMessageToTelegram(chatId ?? '', 'Comando inválidos')
    } catch (error: any) {
      console.error('err', error)
      await sendMessageToTelegram(chatId ?? '', error?.message ?? 'Comando inválidos')
      throw new Error(error?.message ?? 'Comando inválidos')
    }
  }
}
