import { CreateTransactionsType } from '../../shared/types'

export interface TransactionRepositoryInterface {
  create(transaction: CreateTransactionsType): Promise<void>
}
