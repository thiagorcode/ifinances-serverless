import 'reflect-metadata';
import { injectable, container, inject } from 'tsyringe';
import { TransactionsRepositoryInterface } from '../repository/interface/transactions.repository.interface';
@injectable()
export class FindLastService {
  constructor(
    @inject('TransactionsRepository')
    private transactionsRepository: TransactionsRepositoryInterface
  ) {}

  async execute(userId: string) {
    console.log('service', userId);
    return this.transactionsRepository.findLast(userId);
  }
}
