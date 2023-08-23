import { TransactionsCategoryTypes } from '../types';

export interface TransactionsCategoryRepositoryInterface {
  findAll(): Promise<TransactionsCategoryTypes | undefined>;
}
