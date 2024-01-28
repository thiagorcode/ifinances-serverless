import { AppErrorException } from '../utils'
import { messages } from '../shared/constants/messages'
import { ProcessMessageType } from '../shared/types'
import { parseCommand } from '../utils/parseCommand'
import { listCommands } from '../shared/constants/listCommands'

export class ProcessMessageCore {
  execute({ message }: ProcessMessageType): { cmd: string; attributes: string[]; errorMessage?: string } {
    console.info('call ProcessMessage')
    // Envio de um SQS Update para o User quando verificar que é o primeiro acesso
    const messageCommands = parseCommand(message)
    const cmd = messageCommands?.cmd.toLocaleLowerCase()
    const notIncludedCommands = !listCommands.includes(cmd ?? '')
    if (!cmd || notIncludedCommands) {
      console.error('Invalid Command')
      return {
        cmd: '',
        attributes: [''],
        errorMessage: messages.commands.not_found,
      }
    }

    let attributes = null
    if (messageCommands?.tokens) {
      attributes = messageCommands.tokens.filter((token) => token !== '-')
    }
    return {
      cmd,
      attributes: attributes ?? [''],
    }
  }
}
