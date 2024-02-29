import destr from 'destr'
import { SQSEvent } from 'aws-lambda'
import { EventsTransactionsRepository } from '../repository/eventsTransactions.repository'
import { EventTransactions } from '../shared/types'
import { EventsTransactionsCore } from '../core/eventsTransactions.core'

export const handler = async (event: SQSEvent): Promise<PromiseSettledResult<void>[]> => {
  const eventsTransactionsRepository = new EventsTransactionsRepository()
  const eventTransactionCore = new EventsTransactionsCore(eventsTransactionsRepository)

  const recordPromises = event.Records.map(async (record) => {
    console.log(`MessageId: ${record.messageId} `)
    console.log(`Record: ${JSON.stringify(record)} `)

    const body = destr<EventTransactions>(record.body)
    console.log(`Body: ${JSON.stringify(body)} `)

    await eventTransactionCore.execute(body)
  })
  const resultPromises = await Promise.allSettled(recordPromises)
  console.debug('resultPromises: ', resultPromises)

  return resultPromises
}
