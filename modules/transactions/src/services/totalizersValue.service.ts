import { FindAllWithQueryDto } from '@/repository/types';
import { totalizersValue } from '@/utils/totalizersValue';
import 'reflect-metadata';
import { injectable, container, inject } from 'tsyringe';
import { TransactionsRepositoryInterface } from '../repository/interface/transactions.repository.interface';
@injectable()
export class TotalizersValueService {
  constructor(
    @inject('TransactionsRepository')
    private transactionsRepository: TransactionsRepositoryInterface
  ) {}

  async execute(query: FindAllWithQueryDto) {
    console.log('totalizers value', query);
    // Melhorar salvando o valor em algum lugar/ Redis por exemplo
    const transactions = await this.transactionsRepository.findAllWithQuery(
      query
    );

    const totalizers = totalizersValue(transactions);

    return totalizers;
  }
}
