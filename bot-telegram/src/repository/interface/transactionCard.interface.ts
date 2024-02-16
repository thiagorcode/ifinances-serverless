import { TransactionCardType } from '../../shared/types'

export interface TransactionCardRepositoryInterface {
  findByUserId(userId: string): Promise<TransactionCardType[]>
}
