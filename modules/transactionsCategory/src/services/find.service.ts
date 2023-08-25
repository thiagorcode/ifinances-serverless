import 'reflect-metadata';
import { injectable, inject } from 'tsyringe';
import { TransactionsCategoryRepositoryInterface } from '../repository/interface/transactions.repository.interface';
@injectable()
export class FindService {
  constructor(
    @inject('TransactionsCategoryRepository')
    private transactionsRepository: TransactionsCategoryRepositoryInterface
  ) {}

  async execute(id: string) {
    console.log(`Service find ${id}`);
    return this.transactionsRepository.find(id);
  }
}
