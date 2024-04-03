import destr from 'destr'
import { EventTransactions } from '../shared/types'
import { EventsCore } from '../core/events.core'
import { EventsRepository } from '../repository/events.repository'

type EventImportData = {
  tableName: string
}

export const handler = async (event: EventImportData) => {
  const eventsRepository = new EventsRepository(event.tableName)
  const eventTransactionCore = new EventsCore(eventsRepository)

  console.log(event)

  return
}
