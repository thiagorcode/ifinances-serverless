import { container } from 'tsyringe';
import { ReportsTransactionsRepositoryInterface } from '../../repository/interface/reportsTransactionsRepository.interface';
import { ReportsTransactionsMonthly } from '../../repository/reportsTransactionsMonthly.repository';

container.registerSingleton<ReportsTransactionsRepositoryInterface>(
  'ReportsTransactionsMonthly',
  ReportsTransactionsMonthly
);
