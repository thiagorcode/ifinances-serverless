import { TransactionCardType } from '../../shared/types'

export interface TransactionCardRepositoryInterface {
  findAll(): Promise<TransactionCardType[]>
}
