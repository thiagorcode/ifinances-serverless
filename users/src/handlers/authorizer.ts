import { APIGatewayRequestAuthorizerEvent, APIGatewaySimpleAuthorizerResult } from 'aws-lambda'
import { AuthorizerCore } from '../core/authorizer.core'

export const handler = async (event: APIGatewayRequestAuthorizerEvent): Promise<APIGatewaySimpleAuthorizerResult> => {
  try {
    console.debug('Event:', event)
    const authorizerCore = new AuthorizerCore()
    const statusAccess = await authorizerCore.execute(event.headers?.authorization ?? '')
    console.info('status', statusAccess)
    return { isAuthorized: statusAccess }
  } catch (err) {
    console.error('handler error', err)
    return { isAuthorized: false }
  }
}
