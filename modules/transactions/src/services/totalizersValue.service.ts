import { totalizersValue } from '../utils/totalizersValue';
import 'reflect-metadata';
import { injectable, container, inject } from 'tsyringe';
import { TransactionsRepositoryInterface } from '../repository/interface/transactions.repository.interface';
import { FindAllWithQueryService } from './findAllWithQuery.service';
import { FindAllWithQueryServiceDto } from '../repository/types';
import { findAllWithQuerySchema } from '../repository/schemas';
@injectable()
export class TotalizersValueService {
  constructor(
    @inject('TransactionsRepository')
    private transactionsRepository: TransactionsRepositoryInterface
  ) {}

  async execute({
    userId,
    categoryId,
    date,
    isPaid,
    type,
  }: FindAllWithQueryServiceDto) {
    const query = { userId, categoryId, date, isPaid, type };
    console.log('FindAllWithQueryService paths', query);
    const validatedQuery = findAllWithQuerySchema.parse(query);
    console.log('totalizers value', query);
    // Melhorar salvando o valor em algum lugar/ Redis por exemplo
    const transactions = await this.transactionsRepository.findAllWithQuery(
      validatedQuery
    );

    const totalizers = totalizersValue(transactions);

    return totalizers;
  }
}
