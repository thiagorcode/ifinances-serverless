import { errorMessages } from '../shared/messages/error'
import { ProcessMessageType } from '../shared/types'
import { parseCommand } from '../utils/parseCommand'

export class ProcessMessageCore {
  async execute({ message, user, sendMessageTelegramCore }: ProcessMessageType) {
    console.info('call ProcessMessage')
    // Envio de um SQS Update para o User quando verificar que é o primeiro acesso
    try {
      if (!user) {
        await sendMessageTelegramCore.execute(errorMessages.user_not_found)
      }
      if (!message) throw new Error('Invalid Command')
      const messageCommands = parseCommand(message)
    } catch (error: any) {
      console.error('err', error)
      throw new Error(error?.message ?? 'Comando inválidos')
    }
  }
}
