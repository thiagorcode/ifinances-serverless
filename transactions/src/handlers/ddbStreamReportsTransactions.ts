import { SQSRepository } from '../repository/sqs.repository'
import { DynamoDBStreamEvent } from 'aws-lambda'
import { SendTransactionsReportsSQSCore } from '../core/sendTransactionsReportsSQS.core'
import { parseEventDynamoDB } from '../utils/parseEventDynamoDB'
import { SendTransactionsReportsSQSType, TransactionsTypes } from '../shared/types'

export const handler = async (event: DynamoDBStreamEvent): Promise<PromiseSettledResult<void>[]> => {
  const repositorySQS = new SQSRepository()
  const sendTransactionsReportsSQSCore = new SendTransactionsReportsSQSCore(repositorySQS)
  console.debug('Records: ', event.Records)
  const recordPromises = event.Records.map(async (record) => {
    console.log(`EventId: ${record?.eventID} `)
    console.log(`Event Body: ${JSON.stringify(record.dynamodb)} `)
    if (!record.dynamodb) return

    const eventType = record.eventName
    const parsedEventNewImageDynamoDb = parseEventDynamoDB(record.dynamodb?.NewImage) as TransactionsTypes
    const parsedEventOldImageDynamoDb = parseEventDynamoDB(record.dynamodb?.OldImage) as TransactionsTypes
    const transactionsReports: SendTransactionsReportsSQSType = {
      eventType,
      newItem: parsedEventNewImageDynamoDb,
      oldItem: parsedEventOldImageDynamoDb,
    }
    console.log(`Parsed transactionsReports Event: ${JSON.stringify(transactionsReports)}`)

    await sendTransactionsReportsSQSCore.execute(transactionsReports)
  })
  const resultPromises = await Promise.allSettled(recordPromises)
  console.debug('resultPromises: ', resultPromises)

  return resultPromises
}
