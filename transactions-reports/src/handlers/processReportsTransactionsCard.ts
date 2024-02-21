import { SQSEvent } from 'aws-lambda'
import { SendTransactionsReportsSQSType } from '../shared/types'
import { MiddlewareCard } from '../middleware/MiddlewareCard'

export const handler = async (event: SQSEvent): Promise<PromiseSettledResult<void>[]> => {
  const recordPromises = event.Records.map(async (record) => {
    console.log(`MessageId: ${record.messageId}`)
    const body: SendTransactionsReportsSQSType = JSON.parse(record.body)
    console.log(`Body: ${JSON.stringify(body)} `)
    const middlewareCard = new MiddlewareCard(body, record.messageId)
    await middlewareCard.execute()
  })
  const resultPromises = await Promise.allSettled(recordPromises)
  console.debug('resultPromises: ', resultPromises)

  return resultPromises
}
