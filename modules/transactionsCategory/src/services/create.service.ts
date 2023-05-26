import { AppErrorException } from '../utils/appErrorException';
import { injectable, inject } from 'tsyringe';
import { transactionsSchema } from '../repository/schemas/transactions.schema';
import { TransactionsTypes } from '../repository/types/transactions.types';
import { TransactionsRepositoryInterface } from '../repository/interface/transactions.repository.interface';
@injectable()
export class CreateTransactionService {
  constructor(
    @inject('TransactionRepository')
    private transactionsRepository: TransactionsRepositoryInterface
  ) {}

  async execute(transaction: TransactionsTypes) {
    console.info('create transaction service');
    try {
      const transactionValidate = transactionsSchema.parse(transaction);
      return this.transactionsRepository.create(transactionValidate);
    } catch (error) {
      throw new AppErrorException(400, 'Erro no envio dos dados!@', error);
    }
  }
}
