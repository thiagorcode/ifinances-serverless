import { AppErrorException } from '../utils/appErrorException';
import { injectable, inject } from 'tsyringe';
import { transactionsSchema } from '../repository/schemas/transactions.schema';
import { CreateTransactionsDto } from '../repository/types/createTransactions.types';
import { TransactionsRepositoryInterface } from '../repository/interface/transactions.repository.interface';
@injectable()
export class CreateTransactionService {
  constructor(
    @inject('TransactionsRepository')
    private transactionsRepository: TransactionsRepositoryInterface
  ) {}

  async execute(transaction: CreateTransactionsDto) {
    console.info('create transaction service');
    try {
      const transactionValidate = transactionsSchema.parse(transaction);
      console.log('transactionValidate', transactionValidate);
      return this.transactionsRepository.create(transactionValidate);
    } catch (error) {
      throw new AppErrorException(400, 'Erro no envio dos dados!@', error);
    }
  }
}
