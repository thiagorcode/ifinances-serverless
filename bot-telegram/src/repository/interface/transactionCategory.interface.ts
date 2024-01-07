import { TransactionCategoryType } from '../../shared/types'

export interface TransactionCategoryRepositoryInterface {
  findAll(): Promise<TransactionCategoryType[]>
}
