import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import { DynamoDBRepository } from '../repository/dynamodb.repository'
import { AppErrorException, formatResponse } from '../utils'
import { FindUsersCore } from '../core/findUsers.core'

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    console.debug('Event:', event)

    const repository = new DynamoDBRepository()
    const findUsersCore = new FindUsersCore(repository)

    const users = await findUsersCore.execute()
    return formatResponse(200, {
      message: 'Buscas realizada com sucesso!',
      users,
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
