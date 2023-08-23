import 'reflect-metadata';
import { injectable, inject } from 'tsyringe';
import { TransactionsCategoryRepositoryInterface } from '../repository/interface/transactions.repository.interface';
@injectable()
export class FindService {
  constructor(
    @inject('TransactionsCategoryRepository')
    private transactionsRepository: TransactionsCategoryRepositoryInterface
  ) {}

  async execute() {
    console.log('service findAll');
    return this.transactionsRepository.findAll();
  }
}
