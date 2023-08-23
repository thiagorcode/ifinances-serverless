import 'reflect-metadata';
import { injectable, inject } from 'tsyringe';
import { FindAllWithQueryServiceDto } from '../repository/types';
import { TransactionsRepositoryInterface } from '../repository/interface/transactions.repository.interface';
import { findAllWithQuerySchema } from '../repository/schemas';
@injectable()
export class FindAllWithQueryService {
  constructor(
    @inject('TransactionsRepository')
    private transactionsRepository: TransactionsRepositoryInterface
  ) {}

  async execute({
    categoryId,
    date,
    isPaid,
    type,
    userId,
  }: FindAllWithQueryServiceDto) {
    const query = { userId, categoryId, date, isPaid, type };
    console.log('FindAllWithQueryService paths', query);
    const validatedQuery = findAllWithQuerySchema.parse(query);
    return this.transactionsRepository.findAllWithQuery(validatedQuery);
  }
}
