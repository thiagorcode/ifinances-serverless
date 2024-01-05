import { createTransactionFromTelegramSchema } from '../shared/schemas'
import { SQSRepositoryInterface } from '../repository/interface/sqsRepository.interface'
import { CreateTransactionFromTelegramType } from '../shared/types/createTransactionFromTelegram.type'
import { AppErrorException } from '../utils'
import { errorMessages } from '../shared/constants/errorMessages'
import { randomUUID } from 'crypto'

export class CreateTransactionQueueCore {
  constructor(private sqsRepository: SQSRepositoryInterface) {}

  async execute(transaction: CreateTransactionFromTelegramType) {
    try {
      console.info('call CreateTransactionQueueCore')
      const transactionParsed = createTransactionFromTelegramSchema.parse(transaction)
      console.log('transaction', transactionParsed)
      return await this.sqsRepository.send(transactionParsed, process.env.CREATE_TRANSACTION_QUEUE_NAME)
    } catch (error) {
      console.error(error)
      throw new AppErrorException(400, errorMessages.transaction_invalid)
    }
  }
}
