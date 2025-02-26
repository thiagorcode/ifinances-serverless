import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import { TransactionRepository } from '../repository/transactions.repository'
import { AppErrorException, formatResponse } from '../utils'
import { FindCore } from '../core/find.core'

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    console.debug('Event:', event)
    const transactionId = event.pathParameters?.id
    if (!transactionId) {
      throw new AppErrorException(400, 'Não foi enviado o parâmetro transactionId!')
    }
    const repository = new TransactionRepository()
    const findCore = new FindCore(repository)

    const transactions = await findCore.execute(transactionId)
    return formatResponse(200, {
      message: 'Buscas realizada com sucesso!',
      transactions,
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
