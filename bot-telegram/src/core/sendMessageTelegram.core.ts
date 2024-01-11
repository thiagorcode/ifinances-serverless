import { GetParameterCommand, SSMClient } from '@aws-sdk/client-ssm'
import { sendMessageToTelegram } from '../utils'

export class SendMessageTelegramCore {
  public chatId: string
  constructor(chatId: string) {
    this.chatId = chatId
  }
  private async loadTokenBot() {
    const client = new SSMClient()
    const command = new GetParameterCommand({
      Name: `/${process.env.ENV}/${process.env.SECRET_TELEGRAM}/token`,
    })
    const data = await client.send(command)
    return data.Parameter?.Value
  }
  async execute(message: string) {
    console.info('call SendMessageTelegramCore')
    const secretTokenBotTelegram = await this.loadTokenBot()
    console.log(secretTokenBotTelegram)
    return await sendMessageToTelegram(secretTokenBotTelegram ?? '', this.chatId, message)
  }
}
