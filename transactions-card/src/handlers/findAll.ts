import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import { TransactionCardRepository } from '../repository/transactionsCard.repository'
import { AppErrorException, formatResponse } from '../utils'
import { FindAllCore } from '../core/findAll.core'

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    console.debug('Event:', event)
    const userId = event.pathParameters?.userId
    if (!userId) {
      throw new AppErrorException(400, 'Não foi enviado o parâmetro userId!')
    }
    const query = event.queryStringParameters as any
    const repository = new TransactionCardRepository()
    const findAllCore = new FindAllCore(repository)
    const transactions = await findAllCore.execute({
      userId,
      categoryId: query.categoryId,
      date: query.date,
      isPaid: query.isPaid,
      type: query.type,
    })

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
