import {
  CreateTransactionsType,
  TransactionsTypes,
  UpdateTransactionsType,
} from '../../shared/types'

export interface EventsTransactionsRepositoryInterface {
  create(transaction: CreateTransactionsType): Promise<void>
  findAll(): Promise<TransactionsTypes>
  update(id: string, transaction: UpdateTransactionsType): Promise<void>
}
