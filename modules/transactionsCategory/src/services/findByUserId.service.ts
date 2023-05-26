import 'reflect-metadata';
import { injectable, container, inject } from 'tsyringe';
import { TransactionsRepositoryInterface } from '../repository/interface/transactions.repository.interface';
@injectable()
class FindByUserId {
  constructor(
    @inject('TransactionsRepository')
    private transactionsRepository: TransactionsRepositoryInterface
  ) {}

  async execute(userId: string) {
    console.log('service', userId);
    return this.transactionsRepository.findByUserId(userId);
  }
}

export const findByUserIdService = () => {
  const service = container.resolve(FindByUserId);
  console.info('Resolve service findByUserId');
  return service;
};
