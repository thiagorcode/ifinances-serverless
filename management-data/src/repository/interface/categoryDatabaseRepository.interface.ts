import { TransactionsCategoryTypes } from '../../shared/schemas'

export default interface CategoryDatabaseRepositoryInterface {
  create(category: TransactionsCategoryTypes): Promise<void>
}
