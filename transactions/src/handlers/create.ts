import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import { TransactionRepository } from '../repository/transactions.repository'
import { CreateCore } from '../core/create.core'
import { AppErrorException, formatResponse } from '../utils'
import { CreateTransactionsType } from '../shared/types'

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    const body = event.body
    console.debug('Body:', body)
    if (!body) {
      throw new AppErrorException(400, 'Body not found!')
    }
    const bodyParse: CreateTransactionsType = JSON.parse(body)
    const repository = new TransactionRepository()
    const createTransactionCore = new CreateCore(repository)

    await createTransactionCore.execute(bodyParse)
    return formatResponse(200, {
      message: 'Transação criada com sucesso!',
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
