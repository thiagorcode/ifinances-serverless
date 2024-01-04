import { createTransactionFromTelegramSchema } from '../shared/schemas'
import { SQSRepositoryInterface } from '../repository/interface/sqsRepository.interface'
import { CreateTransactionFromTelegramType } from '../shared/types/createTransactionFromTelegram.type'

export class CreateTransactionQueueCore {
  constructor(private sqsRepository: SQSRepositoryInterface) {}

  async execute(transaction: CreateTransactionFromTelegramType) {
    console.info('call CreateTransactionQueueCore', transaction)
    createTransactionFromTelegramSchema.parse(transaction)
    return await this.sqsRepository.send(transaction, process.env.QUEUE_TRANSACTION_NAME)
  }
}
