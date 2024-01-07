import { AppErrorException } from '../utils'
import { messages } from '../shared/constants/messages'
import { ProcessMessageType } from '../shared/types'
import { parseCommand } from '../utils/parseCommand'
import { listCommands } from '../shared/constants/listCommands'
import { CreateTransactionTelegramType } from '../shared/types/createTransactionFromTelegram.type'

export class ProcessMessageCore {
  async execute({ message, user }: ProcessMessageType): Promise<{ transaction: CreateTransactionTelegramType }> {
    console.info('call ProcessMessage')
    // Envio de um SQS Update para o User quando verificar que é o primeiro acesso
    try {
      const messageCommands = parseCommand(message)
      const cmd = messageCommands?.cmd.toLocaleLowerCase()
      if (!cmd || !listCommands.includes(cmd ?? '') || !messageCommands?.tokens) {
        console.error('Invalid Command')
        throw new AppErrorException(400, messages.command_not_found)
      }

      const attributes = messageCommands.tokens.filter((token) => token !== '-')

      if (attributes.length < 4) {
        throw new AppErrorException(400, messages.command_invalid)
      }
      return {
        transaction: {
          date: attributes[0],
          categoryName: attributes[1],
          value: attributes[2],
          cardName: attributes[3],
          description: attributes[4] ?? '',
          userId: user.userId,
          type: messageCommands?.cmd.toLowerCase() === '/adicionarreceita' ? '+' : '-',
          originCreate: 'telegram',
        },
      }
    } catch (error: any) {
      console.error('err', error)
      throw new Error(error?.message ?? messages.command_invalid)
    }
  }
}
