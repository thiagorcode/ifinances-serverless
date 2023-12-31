import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import { DynamoDBRepository } from '../repository/dynamodb.repository'
import { AppErrorException, formatResponse } from '../utils'
import { ValidateAuthCore } from '../core/validateAuth.core'
import destr from 'destr'

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    console.debug('Event:', event)
    const repository = new DynamoDBRepository()
    const validateAuth = new ValidateAuthCore(repository)

    if (!event.body) {
      throw new AppErrorException(400, 'Body not found!')
    }
    const body = destr<{ username: string; password: string }>(event.body)
    console.debug('Body:', body)
    const statusAccess = await validateAuth.execute(body.username, body.password)

    return formatResponse(200, {
      message: 'Login',
      statusAccess,
    })
  } catch (err) {
    console.error(err)

    if (err instanceof AppErrorException) {
      return formatResponse(err.statusCode, {
        message: err.message,
      })
    }
    return formatResponse(500, {
      message: 'some error happened',
    })
  }
}
