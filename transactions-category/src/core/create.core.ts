import { TransactionsCategoryTypes } from '../shared/types'
import CategoryDatabaseRepositoryInterface from '../repository/interface/categoryDatabaseRepository.interface'

export class CreateCore {
  constructor(private repository: CategoryDatabaseRepositoryInterface) {}

  async execute(category: TransactionsCategoryTypes) {
    console.info('init create core')
    return await this.repository.create(category)
  }
}
