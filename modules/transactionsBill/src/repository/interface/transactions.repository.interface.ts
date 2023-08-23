import {
  CreateTransactionsDto,
  FindAllWithQueryDto,
  TransactionsTypes,
} from '../types';

export interface TransactionsRepositoryInterface {
  findByUserId(userId: string): Promise<TransactionsTypes[]>;
  create(transaction: CreateTransactionsDto): Promise<CreateTransactionsDto>;
  find(id: string): Promise<TransactionsTypes>;
  findAllWithQuery(query: FindAllWithQueryDto): Promise<TransactionsTypes[]>;
  findLast(userId: string): Promise<TransactionsTypes[]>;
  update(id: string, transaction: Partial<TransactionsTypes>): Promise<void>;
}
