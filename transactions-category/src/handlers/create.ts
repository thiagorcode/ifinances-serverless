import { UsersTypes } from '../shared/types/users.types'
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import { DynamoDBRepository } from '../repository/dynamodb.repository'
import { CreateUserCore } from '../core/createUser.core'
import { AppErrorException, formatResponse } from '../utils'

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    console.debug('Event:', event)
    const body = event.body
    console.debug('Body:', body)
    if (!body) {
      throw new AppErrorException(400, 'Body not found!')
    }
    const bodyParse: UsersTypes = JSON.parse(body)
    const repository = new DynamoDBRepository()
    const createUserCore = new CreateUserCore(repository)

    await createUserCore.execute(bodyParse)
    return formatResponse(200, {
      message: 'Usuário criado com sucesso!',
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
