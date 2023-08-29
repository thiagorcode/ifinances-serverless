import { container } from 'tsyringe';
import { ReportsTransactionsInterface } from '../../repository/interface/reportsTransactionsRepository.interface';
import { ReportsTransactions } from '../../repository/reportsTransactionsMonthly.repository';

container.registerSingleton<ReportsTransactionsInterface>(
  'ReportsTransactions',
  ReportsTransactions
);
