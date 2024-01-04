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
        return
      }
      const messageCommands = parseCommand(message)
      if (!messageCommands?.cmd) {
        console.error('Invalid Command')
        await sendMessageTelegramCore.execute(errorMessages.command_not_found)
        return
      }

      const attributes = messageCommands.tokens.filter((token) => token !== '-')

      if (attributes.length < 4) {
        await sendMessageTelegramCore.execute(errorMessages.command_invalid)
        return
      }
      return {
        date: attributes[0],
        category: attributes[1],
        card: attributes[2],
        value: attributes[3],
        description: attributes[4] ?? '',
        userId: user.id,
        type: messageCommands?.cmd.toLowerCase() === '/adicionarreceita' ? '+' : '-',
      }
    } catch (error: any) {
      console.error('err', error)
      throw new Error(error?.message ?? errorMessages.command_invalid)
    }
  }
}
