import { CreateCardTransactionsType, TransactionsTypes, UpdateTransactionsCardType } from '../../shared/types'

export interface TransactionCardRepositoryInterface {
  findByUserId(userId: string): Promise<TransactionsTypes[]>
  create(transaction: CreateCardTransactionsType): Promise<void>
  find(id: string): Promise<TransactionsTypes>
  delete(id: string): Promise<void>
  update(id: string, transaction: UpdateTransactionsCardType): Promise<void>
}
