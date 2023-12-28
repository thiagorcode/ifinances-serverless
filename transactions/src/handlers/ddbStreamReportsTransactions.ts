import { SQSRepository } from '../repository/sqs.repository'
import { DynamoDBStreamEvent } from 'aws-lambda'
import { SendTransactionsReportsSQSCore } from '../core/sendTransactionsReportsSQS.core'

export const handler = async (event: DynamoDBStreamEvent): Promise<PromiseSettledResult<void>[]> => {
  const repositorySQS = new SQSRepository()
  const sendTransactionsReportsSQSCore = new SendTransactionsReportsSQSCore(repositorySQS)
  const recordPromises = event.Records.map(async (record) => {
    console.log(`EventId: ${record?.eventID} `)
    console.log(`Event Body: ${JSON.stringify(record.dynamodb)} `)
    if (!record.dynamodb) return
    await sendTransactionsReportsSQSCore.execute(record.dynamodb)
  })
  const resultPromises = await Promise.allSettled(recordPromises)
  console.debug('resultPromises: ', resultPromises)

  return resultPromises
}
