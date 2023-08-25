import { TransactionsCategoryTypes } from '../types';

export interface TransactionsCategoryRepositoryInterface {
  findAll(): Promise<TransactionsCategoryTypes | undefined>;
  find(id: string): Promise<TransactionsCategoryTypes | undefined>;
}
