import { SQSEvent } from 'aws-lambda'
import { SendTransactionsReportsSQSType } from '../shared/types'
import { MiddlewareMonthly } from '../middleware/MiddlewareMonthly'

export const handler = async (event: SQSEvent): Promise<PromiseSettledResult<void>[]> => {
  const recordPromises = event.Records.map(async (record) => {
    console.log(`MessageId: ${record.messageId} `)
    // usar outra coisa sem ser JSON.parse
    console.log(`Body: ${record.body} `)
    const body: SendTransactionsReportsSQSType = JSON.parse(record.body)
    const middlewareCard = new MiddlewareMonthly(body, record.messageId)
    await middlewareCard.execute()
  })
  const resultPromises = await Promise.allSettled(recordPromises)
  console.debug('resultPromises: ', resultPromises)

  return resultPromises
}
