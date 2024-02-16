import { EventTransactions } from '../../shared/types'

export interface EventsTransactionsRepositoryInterface {
  create(eventTransaction: EventTransactions): Promise<void>
  findAll(): Promise<EventTransactions[]>
  update(id: string, eventTransaction: EventTransactions): Promise<void>
}
