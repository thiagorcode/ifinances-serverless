import { CreateReportsTransactionCategoryCore } from '../core/createReportsTransactionCategory.core'
import { SQSEvent } from 'aws-lambda'
import { ReportsTransactionsCategoryRepository } from '../repository/reportsTransactionsCategory.repository'

export const handler = async (event: SQSEvent): Promise<PromiseSettledResult<void>[]> => {
  const repository = new ReportsTransactionsCategoryRepository()
  const createReportsTransactionCategoryCore = new CreateReportsTransactionCategoryCore(repository)

  const recordPromises = event.Records.map(async (record) => {
    console.log(`MessageId: ${record.messageId} `)
    // usar outra coisa sem ser JSON.parse
    const body = JSON.parse(record.body)
    await createReportsTransactionCategoryCore.execute(body)
  })
  const resultPromises = await Promise.allSettled(recordPromises)
  console.debug('resultPromises: ', resultPromises)

  return resultPromises
}
