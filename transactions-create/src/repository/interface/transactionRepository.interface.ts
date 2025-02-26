import { CreateTransactionsType, TransactionsTypes } from '../../shared/types'

export default interface DynamoDBRepositoryInterface {
  create(transaction: CreateTransactionsType): Promise<void>
  find(id: string): Promise<TransactionsTypes>
}
