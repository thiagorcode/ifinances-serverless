import { TransactionsTypes } from '../types';

export interface TransactionsRepositoryInterface {
  findByUserId(userId: string): Promise<TransactionsTypes | undefined>;
  create(user: TransactionsTypes): Promise<TransactionsTypes>;
}
