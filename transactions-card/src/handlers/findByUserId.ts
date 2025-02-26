import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import { TransactionCardRepository } from '../repository/transactionsCard.repository'
import { AppErrorException, formatResponse } from '../utils'
import { FindByUserIdCore } from '../core/findByUserId.core'

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    console.debug('Event:', event)
    const userId = event.requestContext.authorizer?.lambda?.id as string
    if (!userId) {
      throw new AppErrorException(400, 'Não foi enviado o userId!')
    }

    const repository = new TransactionCardRepository()
    const cardFindByUserIdCore = new FindByUserIdCore(repository)
    const cards = await cardFindByUserIdCore.execute(userId)

    return formatResponse(200, {
      message: 'Buscas realizada com sucesso!',
      cards,
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
