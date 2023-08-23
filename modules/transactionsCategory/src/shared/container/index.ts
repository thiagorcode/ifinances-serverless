import { container } from 'tsyringe';
import { TransactionsCategoryRepositoryInterface } from '../../repository/interface/transactions.repository.interface';
import { TransactionsCategoryRepository } from '../../repository/transactions.repository';

container.registerSingleton<TransactionsCategoryRepositoryInterface>(
  'TransactionsCategoryRepository',
  TransactionsCategoryRepository
);
