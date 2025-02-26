import { TransactionsCategoryTypes } from '../../shared/types'

export default interface CategoryDatabaseRepositoryInterface {
  create(category: TransactionsCategoryTypes): Promise<void>
  findAll(): Promise<TransactionsCategoryTypes[]>
}
