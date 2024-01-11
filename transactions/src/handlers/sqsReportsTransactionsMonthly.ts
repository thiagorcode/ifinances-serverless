import { ReportsTransactionsMonthlyRepository } from '../repository/reportsTransactionsMonthly.repository'
import { SQSEvent, Context } from 'aws-lambda'
import { CreateReportsTransactionMonthlyCore } from '../core/createReportsTransactionMonthly.core'
import { SendTransactionsReportsSQSType } from '../shared/types'
import { DecreaseValueReportsTransactionMonthlyCore } from '../core/decreaseValueReportsTransactionMonthly.core'

export const handler = async (event: SQSEvent, context: Context): Promise<PromiseSettledResult<void>[]> => {
  const repository = new ReportsTransactionsMonthlyRepository()
  const createReportsTransactionMonthlyCore = new CreateReportsTransactionMonthlyCore(repository)
  const decreaseValueReportsMonthlyCore = new DecreaseValueReportsTransactionMonthlyCore(repository)

  const recordPromises = event.Records.map(async (record) => {
    console.log(`MessageId: ${record.messageId} `)
    // usar outra coisa sem ser JSON.parse
    console.log(`Body: ${record.body} `)
    const body: SendTransactionsReportsSQSType = JSON.parse(record.body)
    if (body.eventType === 'REMOVE') {
      await decreaseValueReportsMonthlyCore.execute(body.oldItem)
      return
    }
    if (body.eventType === 'MODIFY') {
      await decreaseValueReportsMonthlyCore.execute(body.oldItem)
    }

    await createReportsTransactionMonthlyCore.execute(body.newItem)
  })
  const resultPromises = await Promise.allSettled(recordPromises)
  console.debug('resultPromises: ', resultPromises)

  return resultPromises
}
