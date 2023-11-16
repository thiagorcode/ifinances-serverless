import { ReportsTransactionsMonthlyRepository } from '../repository/reportsTransactionsMonthly.repository'
import { SQSEvent, Context } from 'aws-lambda'
import { CreateReportsTransactionMonthlyCore } from '../core/createReportsTransactionMonthly.core'

export const handler = async (event: SQSEvent, context: Context): Promise<PromiseSettledResult<void>[]> => {
  const repository = new ReportsTransactionsMonthlyRepository()
  const createReportsTransactionMonthlyCore = new CreateReportsTransactionMonthlyCore(repository)

  const recordPromises = event.Records.map(async (record) => {
    console.log(`MessageId: ${record.messageId} `)
    // usar outra coisa sem ser JSON.parse
    const body = JSON.parse(record.body)
    await createReportsTransactionMonthlyCore.execute(body)
  })
  const resultPromises = await Promise.allSettled(recordPromises)
  console.debug('resultPromises: ', resultPromises)

  return resultPromises
}
