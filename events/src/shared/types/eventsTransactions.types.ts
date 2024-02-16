import { EventTypeEnum } from '../../enums'
import { TransactionsTypes } from './transaction.types'

export type EventTransactions = {
  requestId: string
  eventType: EventTypeEnum
  transactionId?: string
  origin: 'web' | 'telegram'
  infoTransaction: TransactionsTypes
  typeRequest: 'CREATE' | 'UPDATE'
  ttl: number
  pk: string
  sk: string
}
