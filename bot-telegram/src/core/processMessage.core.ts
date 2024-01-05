import { AppErrorException } from '../utils'
import { errorMessages } from '../shared/constants/errorMessages'
import { ProcessMessageType } from '../shared/types'
import { parseCommand } from '../utils/parseCommand'
import { listCommands } from '../shared/constants/listCommands'
import { randomUUID } from 'crypto'

export class ProcessMessageCore {
  async execute({ message, user }: ProcessMessageType) {
    console.info('call ProcessMessage')
    // Envio de um SQS Update para o User quando verificar que é o primeiro acesso
    try {
      const messageCommands = parseCommand(message)
      const cmd = messageCommands?.cmd.toLocaleLowerCase()
      if (!cmd || !listCommands.includes(cmd ?? '') || !messageCommands?.tokens) {
        console.error('Invalid Command')
        throw new AppErrorException(400, errorMessages.command_not_found)
      }

      const attributes = messageCommands.tokens.filter((token) => token !== '-')

      if (attributes.length < 4) {
        throw new AppErrorException(400, errorMessages.command_invalid)
      }
      return {
        transaction: {
          date: attributes[0],
          category: {
            id: randomUUID(),
            name: attributes[1],
          },
          card: {
            id: randomUUID(),
            name: attributes[2],
          },
          value: attributes[3],
          description: attributes[4] ?? '',
          userId: user.userId,
          type: messageCommands?.cmd.toLowerCase() === '/adicionarreceita' ? '+' : '-',
          originCreate: 'telegram',
        },
      }
    } catch (error: any) {
      console.error('err', error)
      throw new Error(error?.message ?? errorMessages.command_invalid)
    }
  }
}
