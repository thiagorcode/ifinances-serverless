import { TransactionsTypes } from './transaction.types'

export type SendTransactionsReportsSQSType = {
  eventType: 'INSERT' | 'MODIFY' | 'REMOVE' | undefined
  newItem: TransactionsTypes
  oldItem: TransactionsTypes
}
