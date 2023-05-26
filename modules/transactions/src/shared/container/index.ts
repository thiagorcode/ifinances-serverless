import { container } from 'tsyringe';
import { TransactionsRepositoryInterface } from '../../repository/interface/transactions.repository.interface';
import { TransactionsRepository } from '../../repository/transactions.repository';

container.registerSingleton<TransactionsRepositoryInterface>(
  'TransactionsRepository',
  TransactionsRepository
);
