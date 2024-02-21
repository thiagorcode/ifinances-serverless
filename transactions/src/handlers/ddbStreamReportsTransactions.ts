import { EventBridgeRepository } from '../repository/eventBridge.repository'
import { DynamoDBStreamEvent } from 'aws-lambda'
import { SendTransactionsReportsEventCore } from '../core/sendTransactionsReportsEvents.core'
import { parseEventDynamoDB } from '../utils/parseEventDynamoDB'
import { SendTransactionsReportsEBridgeType, TransactionsTypes } from '../shared/types'

export const handler = async (event: DynamoDBStreamEvent): Promise<PromiseSettledResult<void>[]> => {
  const repositorySQS = new EventBridgeRepository()
  const sendTransactionsReportsEventCore = new SendTransactionsReportsEventCore(repositorySQS)
  console.debug('Records: ', event.Records)
  const recordPromises = event.Records.map(async (record) => {
    console.log(`EventId: ${record?.eventID} `)
    console.log(`Event Body: ${JSON.stringify(record.dynamodb)} `)
    if (!record.dynamodb) return

    const eventType = record.eventName
    const parsedEventNewImageDynamoDb = parseEventDynamoDB(record.dynamodb?.NewImage) as TransactionsTypes
    const parsedEventOldImageDynamoDb = parseEventDynamoDB(record.dynamodb?.OldImage) as TransactionsTypes
    const transactionsReports: SendTransactionsReportsEBridgeType = {
      eventType,
      newItem: parsedEventNewImageDynamoDb,
      oldItem: parsedEventOldImageDynamoDb,
    }
    console.log(`Parsed transactionsReports Event: ${JSON.stringify(transactionsReports)}`)

    await sendTransactionsReportsEventCore.execute(transactionsReports)
  })
  const resultPromises = await Promise.allSettled(recordPromises)
  console.debug('resultPromises: ', resultPromises)

  return resultPromises
}
