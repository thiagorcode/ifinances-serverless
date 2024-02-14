import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import { TransactionCardRepository } from '../repository/transactionsCard.repository'
import { AppErrorException, formatResponse } from '../utils'
import { CreateTransactionsType } from '../shared/types'
import { UpdateCore } from '../core/update.core'

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    const body = event.body
    console.debug('Body:', body)
    if (!body) {
      throw new AppErrorException(400, 'Body not found!')
    }
    const bodyParse: CreateTransactionsType = JSON.parse(body)
    const repository = new TransactionCardRepository()
    const updateTransactionCore = new UpdateCore(repository)

    await updateTransactionCore.execute(bodyParse)
    return formatResponse(200, {
      message: 'Transação atualizada com sucesso!',
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
