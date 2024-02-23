import { EventBridgeEvent } from 'aws-lambda'
import { SendTransactionsReportsEventType } from '../shared/types'
import { MiddlewareMonthly } from '../middleware/MiddlewareMonthly'

export const handler = async (
  event: EventBridgeEvent<'REPORT_MONTHLY', SendTransactionsReportsEventType>,
): Promise<void> => {
  // usar outra coisa sem ser JSON.parse
  console.log(`Envet :: ${JSON.stringify(event)} `)
  const middlewareCard = new MiddlewareMonthly(event.detail, event.id, event['detail-type'])
  await middlewareCard.execute()
}
