import { EventBridgeEvent } from 'aws-lambda'
import { SendTransactionsReportsEventType } from '../shared/types'
import { MiddlewareCard } from '../middleware/MiddlewareCard'

export const handler = async (
  event: EventBridgeEvent<'REPORT_CARD', SendTransactionsReportsEventType>,
): Promise<void> => {
  console.log(`event: ${JSON.stringify(event)} `)
  const middlewareCard = new MiddlewareCard(event.detail, event.id, event['detail-type'])
  await middlewareCard.execute()
}
