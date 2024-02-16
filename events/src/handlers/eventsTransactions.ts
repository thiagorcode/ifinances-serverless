import { APIGatewayProxyResult } from 'aws-lambda'
import { TransactionRepository } from '../repository/transactions.repository'
import { CreateCore } from '../core/create.core'
import { AppErrorException, formatResponse } from '../utils'
import { CreateTransactionsType, TransactionsTypes } from '../shared/types'

enum EventTypeEnum {
  SEND_QUEUE = 'SEND_QUEUE',
  ERROR_IN_SEND_QUEUE = 'ERROR_IN_SEND_QUEUE',
  TRANSACTION_CREATED = 'TRANSACTION_CREATED',
  TRANSACTION_ERROR_IN_CREATED = 'TRANSACTION_ERROR_IN_CREATED',
}

interface EventTransactions {
  requestId: string
  eventType: EventTypeEnum
  transactionId?: string
  origin: 'web' | 'telegram'
  infoTransaction: TransactionsTypes
}

export const handler = async (event: EventTransactions): Promise<APIGatewayProxyResult> => {
  try {
    const body = event
    console.debug('Body:', body)
    if (!body) {
      throw new AppErrorException(400, 'Body not found!')
    }
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
