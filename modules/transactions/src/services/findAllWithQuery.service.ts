import 'reflect-metadata';
import { injectable, inject } from 'tsyringe';
import { FindAllWithQueryDto } from '../repository/types';
import { TransactionsRepositoryInterface } from '../repository/interface/transactions.repository.interface';
@injectable()
export class FindAllWithQueryService {
  constructor(
    @inject('TransactionsRepository')
    private transactionsRepository: TransactionsRepositoryInterface
  ) {}

  async execute({ categoryId, date, isPaid, type }: FindAllWithQueryDto) {
    console.log('FindAllWithQueryService', { categoryId, date, isPaid, type });
    return this.transactionsRepository.findAllWithQuery({
      categoryId,
      date,
      isPaid,
      type,
    });
  }
}
