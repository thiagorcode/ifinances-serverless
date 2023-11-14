import { ReportsTransactionsRepository } from './../repository/reportsTransactions.repository'
import { APIGatewayProxyEvent, APIGatewayProxyResult, SQSEvent, Context } from 'aws-lambda'
import { TransactionRepository } from '../repository/transactions.repository'
import { CreateCore } from '../core/create.core'
import { AppErrorException, formatResponse } from '../utils'
import { CreateTransactionsType } from '../shared/types'
import { CreateReportsTransactionCore } from '../core/createReportsTransaction.core'

export const handler = async (event: SQSEvent, context: Context): PromiseSettledResult<void> => {
  const repository = new ReportsTransactionsRepository()
  const createReportsTransactionCore = new CreateReportsTransactionCore(repository)

  const recordPromises = event.Records.map(async (record) => {
    console.log(`MessageId: ${record.messageId} `)
    // usar outra coisa sem ser JSON.parse
    const body = JSON.parse(record.body)
    await createReportsTransactionCore.execute(body)
  })
  const resultPromises = await Promise.allSettled(recordPromises)
  console.debug('resultPromises: ', resultPromises)

  return resultPromises
}
