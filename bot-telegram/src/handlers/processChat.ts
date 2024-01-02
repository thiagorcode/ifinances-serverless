import { destr } from 'destr'
import { APIGatewayProxyEvent, Callback, Context } from 'aws-lambda'
import { ProcessMessageCore } from '../core/proccessMessage.core'
import { EventTelegramType } from '../shared/types'

export const handler = async (event: APIGatewayProxyEvent, context: Context, callback: Callback) => {
  // adicionar uma tabela de evento
  try {
    console.debug('Event:', event)
    const body = destr<EventTelegramType>(event.body)

    console.debug('Body:', body)
    const processMessageCore = new ProcessMessageCore()

    await processMessageCore.execute(body)
    callback(null)
  } catch (error) {
    callback('invalid')
  }
}
