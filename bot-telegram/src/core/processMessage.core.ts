import { AppErrorException } from '../utils'
import { messages } from '../shared/constants/messages'
import { ProcessMessageType } from '../shared/types'
import { parseCommand } from '../utils/parseCommand'
import { listCommands } from '../shared/constants/listCommands'
import { CommandsChatEnum } from 'src/enums/commandsChat.enum'

export class ProcessMessageCore {
  execute({ message }: ProcessMessageType): { cmd: string; attributes: string[] } {
    console.info('call ProcessMessage')
    // Envio de um SQS Update para o User quando verificar que é o primeiro acesso
    const messageCommands = parseCommand(message)
    const cmd = messageCommands?.cmd.toLocaleLowerCase() as CommandsChatEnum | undefined
    if (!cmd || !listCommands.includes(cmd ?? '') || !messageCommands?.tokens) {
      console.error('Invalid Command')
      throw new AppErrorException(400, messages.commands.not_found)
    }

    const attributes = messageCommands.tokens.filter((token) => token !== '-')

    return {
      cmd,
      attributes,
    }
  }
}
