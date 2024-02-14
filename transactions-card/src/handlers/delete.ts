import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import { TransactionCardRepository } from '../repository/transactionsCard.repository'
import { AppErrorException, formatResponse } from '../utils'
import { DeleteCore } from '../core/delete.core'

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    const transactionId = event.pathParameters?.id

    if (!transactionId) {
      throw new AppErrorException(400, 'transactionId not found!')
    }
    const repository = new TransactionCardRepository()
    const deleteTransactionCore = new DeleteCore(repository)

    await deleteTransactionCore.execute(transactionId)
    return formatResponse(200, {
      message: 'Transação removida com sucesso!',
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
