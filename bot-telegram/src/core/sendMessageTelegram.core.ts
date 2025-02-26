import { GetParameterCommand, SSMClient } from '@aws-sdk/client-ssm'
import axios from 'axios'

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
    const tokenTelegram = await this.loadTokenBot()

    const formData = new FormData()
    formData.append('chat_id', this.chatId)
    formData.append('text', message)

    return axios.post(`https://api.telegram.org/bot${tokenTelegram}/sendMessage`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
  }
}
