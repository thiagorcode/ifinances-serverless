import { SQSEvent } from 'aws-lambda'
import { CreateReportsTransactionCardCore } from '../core/createReportsTransactionCard.core'
import { ReportsTransactionsCardRepository } from '../repository/reportsTransactionsCard.repository'

export const handler = async (event: SQSEvent): Promise<PromiseSettledResult<void>[]> => {
  const repository = new ReportsTransactionsCardRepository()
  const createReportsTransactionCardCore = new CreateReportsTransactionCardCore(repository)

  const recordPromises = event.Records.map(async (record) => {
    console.log(`MessageId: ${record} `)
    // usar outra coisa sem ser JSON.parse
    const body = JSON.parse(record.body)
    await createReportsTransactionCardCore.execute(body)
  })
  const resultPromises = await Promise.allSettled(recordPromises)
  console.debug('resultPromises: ', resultPromises)

  return resultPromises
}