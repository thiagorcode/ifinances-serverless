import { TransactionsTypes } from './transaction.types'

export type SendTransactionsReportsEBridgeType = {
  eventType: 'INSERT' | 'MODIFY' | 'REMOVE' | undefined
  newItem: TransactionsTypes
  oldItem: TransactionsTypes
}
