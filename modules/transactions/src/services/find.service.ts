import 'reflect-metadata';
import { injectable, container, inject } from 'tsyringe';
import { TransactionsRepositoryInterface } from '../repository/interface/transactions.repository.interface';
@injectable()
export class FindService {
  constructor(
    @inject('TransactionsRepository')
    private transactionsRepository: TransactionsRepositoryInterface
  ) {}

  async execute(id: string) {
    console.log('service', id);
    return this.transactionsRepository.find(id);
  }
}
