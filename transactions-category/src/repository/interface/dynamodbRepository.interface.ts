import { TransactionsCategoryTypes } from '../../shared/types'

export default interface DynamoDBRepositoryInterface {
  findAll(): Promise<TransactionsCategoryTypes[]>
}
