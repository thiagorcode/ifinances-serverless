import { ProcessEventType } from '../shared/types'
import { handler as EventImportData } from './eventImportData'
import { EventActionEnum } from '../enums'

export const handler = async (event: ProcessEventType) => {
  switch (event.action) {
    case EventActionEnum.IMPORT_DATA_EVENT:
      return EventImportData({ tableName: process.env.EVENTS_IMPORT_TRANSACTIONS_TABLE_NAME ?? '', ...event })
    default:
      return
  }
}
