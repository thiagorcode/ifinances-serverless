import { UsersTypes } from '../shared/types'
import { SSMClient, GetParameterCommand } from '@aws-sdk/client-ssm'
import { messages } from '../shared/constants/messages'

export class ValidateCore {
  private headers: any
  private user: UsersTypes | null
  constructor(headers: any, user: UsersTypes | null) {
    this.headers = headers
    this.user = user
  }
  async setParameters() {
    const client = new SSMClient()
    const command = new GetParameterCommand({
      Name: `/${process.env.ENV}/${process.env.SECRET_TELEGRAM}/webhook`,
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

  async execute(): Promise<{ isValidRequest: boolean; user: UsersTypes | null; message?: string }> {
    console.info('call validate core')
    let validateData = null
    validateData = await this.validateHeader()

    if (!validateData.isValidEvent) {
      throw new Error()
    }
    if (!this.user) {
      return {
        user: null,
        isValidRequest: false,
        message: messages.user.not_found,
      }
    }

    return {
      isValidRequest: true,
      user: this.user,
    }
  }
}
