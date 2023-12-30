import { SQSEvent } from 'aws-lambda'
import { CreateReportsTransactionCardCore } from '../core/createReportsTransactionCard.core'
import { ReportsTransactionsCardRepository } from '../repository/reportsTransactionsCard.repository'
import { SendTransactionsReportsSQSType } from '../shared/types'
import { DecreaseValueReportsTransactionCardCore } from '../core/decreaseValueReportsTransactionCard.core'

export const handler = async (event: SQSEvent): Promise<PromiseSettledResult<void>[]> => {
  const repository = new ReportsTransactionsCardRepository()
  const createReportsTransactionCardCore = new CreateReportsTransactionCardCore(repository)
  const decreaseValueReportsTransactionCardCore = new DecreaseValueReportsTransactionCardCore(repository)
  const recordPromises = event.Records.map(async (record) => {
    console.log(`MessageId: ${record.messageId}`)
    // usar outra coisa sem ser JSON.parse
    const body: SendTransactionsReportsSQSType = JSON.parse(record.body)
    console.log(`Body: ${JSON.stringify(body)} `)
    if (body.eventType === 'REMOVE') {
      await decreaseValueReportsTransactionCardCore.execute(body.oldItem)
      return
    }
    if (body.eventType === 'MODIFY') {
      await decreaseValueReportsTransactionCardCore.execute(body.oldItem)
    }
    await createReportsTransactionCardCore.execute(body.newItem)
  })
  const resultPromises = await Promise.allSettled(recordPromises)
  console.debug('resultPromises: ', resultPromises)

  return resultPromises
}
