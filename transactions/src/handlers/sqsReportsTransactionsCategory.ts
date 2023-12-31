import { CreateReportsTransactionCategoryCore } from '../core/createReportsTransactionCategory.core'
import { SQSEvent } from 'aws-lambda'
import { ReportsTransactionsCategoryRepository } from '../repository/reportsTransactionsCategory.repository'
import { SendTransactionsReportsSQSType } from '../shared/types'
import { DecreaseValueReportsTransactionCategoryCore } from '../core/decreaseValueReportsTransactionCategory.core'

export const handler = async (event: SQSEvent): Promise<PromiseSettledResult<void>[]> => {
  const repository = new ReportsTransactionsCategoryRepository()
  const createReportsTransactionCategoryCore = new CreateReportsTransactionCategoryCore(repository)
  const decreaseValueReportsCategoryCore = new DecreaseValueReportsTransactionCategoryCore(repository)
  const recordPromises = event.Records.map(async (record) => {
    console.log(`MessageId: ${record.messageId} `)
    // usar outra coisa sem ser JSON.parse
    const body: SendTransactionsReportsSQSType = JSON.parse(record.body)
    console.log(`Body: ${JSON.stringify(body)} `)
    if (body.eventType === 'REMOVE') {
      await decreaseValueReportsCategoryCore.execute(body.oldItem)
      return
    }
    if (body.eventType === 'MODIFY') {
      await decreaseValueReportsCategoryCore.execute(body.oldItem)
    }

    await createReportsTransactionCategoryCore.execute(body.newItem)
  })
  const resultPromises = await Promise.allSettled(recordPromises)
  console.debug('resultPromises: ', resultPromises)

  return resultPromises
}
