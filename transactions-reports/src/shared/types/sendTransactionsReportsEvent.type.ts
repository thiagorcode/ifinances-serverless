import { TransactionsTypes } from './transaction.types'

export type SendTransactionsReportsEventType = {
  eventType: 'INSERT' | 'MODIFY' | 'REMOVE' | undefined
  newItem: TransactionsTypes
  oldItem: TransactionsTypes
}
