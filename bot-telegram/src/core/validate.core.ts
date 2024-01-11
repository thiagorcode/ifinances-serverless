import { UsersTypes } from '../shared/types'
import { AppErrorException } from '../utils'
import { SSMClient, GetParameterCommand } from '@aws-sdk/client-ssm'
import { SendMessageTelegramCore } from './sendMessageTelegram.core'
import { messages } from '../shared/constants/messages'

export class ValidateCore {
  private headers: any
  private user: UsersTypes | null
  private sendMessage: SendMessageTelegramCore
  constructor(headers: any, user: UsersTypes | null, chatId: string) {
    this.headers = headers
    this.user = user
    this.sendMessage = new SendMessageTelegramCore(chatId)
  }
  async setParameters() {
    const client = new SSMClient()
    const command = new GetParameterCommand({
      Name: `/${process.env.ENV}/${process.env.SECRET_TELEGRAM}`,
    })
    const data = await client.send(command)
    return {
      secretTelegram: data.Parameter?.Value,
    }
  }
  async validateHeader() {
    const parameters = await this.setParameters()
    if (this.headers['x-telegram-bot-api-secret-token'] !== parameters.secretTelegram) {
      console.error('invalid secret-token')
      return {
        isValidEvent: false,
        messageError: messages[1],
      }
    }
    return {
      isValidEvent: true,
    }
  }

  async execute(): Promise<{ isValidRequest: boolean; user: UsersTypes }> {
    console.info('call validate core')
    let validateData = null
    validateData = await this.validateHeader()

    if (!validateData.isValidEvent) {
      throw new Error()
    }
    if (!this.user) {
      await this.sendMessage.execute(messages.user.not_found)
      throw new AppErrorException(1, messages.user.not_found)
    }

    return {
      isValidRequest: true,
      user: this.user,
    }
  }
}
