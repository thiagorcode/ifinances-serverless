import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import { TransactionRepository } from '../repository/transactions.repository'
import { AppErrorException, formatResponse } from '../utils'
import { FindAllCore } from '../core/findAll.core'
import { FindAllWithQueryOriginType } from '../shared/types'

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    console.log('data Authorizer:', event.requestContext.authorizer)
    const userId = event.requestContext.authorizer?.lambda?.id as string
    if (!userId) {
      throw new AppErrorException(400, 'Não foi enviado o userId!')
    }
    const query = event.queryStringParameters as FindAllWithQueryOriginType
    const repository = new TransactionRepository()

    const findAllCore = new FindAllCore(repository)
    const transactions = await findAllCore.execute(userId, {
      categoryId: query?.categoryId,
      startDate: query?.startDate,
      endDate: query?.endDate,
      isPaid: query?.isPaid,
      type: query?.type,
      cardId: query?.cardId,
      yearMonth: query?.yearMonth,
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
      message: 'Internal server error',
    })
  }
}
