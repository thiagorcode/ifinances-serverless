import { CreateTransactionsType } from '../../shared/types'

export default interface SQSRepositoryInterface {
  send(transaction: CreateTransactionsType): Promise<void>
}
