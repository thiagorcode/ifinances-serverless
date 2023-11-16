import {
  CreateTransactionsType,
  FindAllWithQueryType,
  TransactionsTypes,
  UpdateTransactionsType,
} from '../../shared/types'

export default interface DynamoDBRepositoryInterface {
  findByUserId(userId: string): Promise<TransactionsTypes[]>
  create(transaction: CreateTransactionsType): Promise<void>
  find(id: string): Promise<TransactionsTypes>
  findAllWithQuery(query: FindAllWithQueryType): Promise<TransactionsTypes[]>
  findLast(userId: string): Promise<TransactionsTypes[]>
  update(id: string, transaction: UpdateTransactionsType): Promise<void>
}
