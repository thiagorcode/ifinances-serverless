import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import { CategoryDatabaseRepository } from '../repository/categoryDatabase.repository'
import { AppErrorException, formatResponse } from '../utils'
import { CreateCore } from '../core/create.core'
import destr from 'destr'
import { TransactionsCategoryTypes } from '../shared/types'

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    console.debug('Event:', event)
    const body = destr<TransactionsCategoryTypes | null>(event.body)
    console.debug('Body:', body)
    if (!body) {
      throw new AppErrorException(400, 'Body not found!')
    }

    const repository = new CategoryDatabaseRepository()
    const createCore = new CreateCore(repository)

    await createCore.execute(body)
    return formatResponse(200, {
      message: 'Categoria criada com sucesso!',
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
