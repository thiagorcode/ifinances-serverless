import { EventBridgeEvent } from 'aws-lambda'
import { SendTransactionsReportsEventType } from '../shared/types'
import { MiddlewareCategory } from '../middleware/MiddlewareCategory'

export const handler = async (
  event: EventBridgeEvent<'REPORT_CARD', SendTransactionsReportsEventType>,
): Promise<void> => {
  console.info(`EventId:: ${event.id} `)
  console.info(`Event:: ${JSON.stringify(event)} `)
  const middlewareCard = new MiddlewareCategory(event.detail, event.id, event['detail-type'])
  await middlewareCard.execute()
}
