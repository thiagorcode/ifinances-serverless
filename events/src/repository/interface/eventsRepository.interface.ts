import { EventTransactions } from '../../shared/types'

export interface EventsRepositoryInterface {
  create(eventTransaction: EventTransactions): Promise<void>
  update(id: string, eventTransaction: EventTransactions): Promise<void>
}
