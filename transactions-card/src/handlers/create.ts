import destr from 'destr'
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import { TransactionCardRepository } from '../repository/transactionsCard.repository'
import { CreateCore } from '../core/create.core'
import { AppErrorException, formatResponse } from '../utils'
import { CreateCardTransactionsType } from '../shared/types'

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    console.debug('Body:', event.body)
    if (!event.body) {
      throw new AppErrorException(400, 'Body not found!')
    }
    const body = destr<CreateCardTransactionsType>(event.body)

    const repository = new TransactionCardRepository()
    const createTransactionCore = new CreateCore(repository)

    await createTransactionCore.execute(body)
    return formatResponse(200, {
      message: 'Cartão criada com sucesso!',
    })
  } catch (err) {
    console.error(err)

    if (err instanceof AppErrorException) {
      return formatResponse(err.statusCode, {
        message: err.message,
      })
    }
    return formatResponse(500, {
      message: 'Erro interno!',
    })
  }
}
