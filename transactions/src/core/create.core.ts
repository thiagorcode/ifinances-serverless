import { CreateTransactionsType } from '../shared/types'
import TransactionRepositoryInterface from '../repository/interface/transactionRepository.interface'
import { AppErrorException } from '../utils'
import { transactionsSchema } from '../shared/schemas'
import { randomUUID } from 'crypto'
import { addMonths, parseISO } from 'date-fns'
import { SQSRepository } from '../repository/sqs.repository'

export class CreateCore {
  constructor(private repository: TransactionRepositoryInterface) {}

  // TODO: CRiar um sqs para criar as transactions

  async execute(transaction: CreateTransactionsType) {
    console.info('init create service')
    try {
      const transactions: CreateTransactionsType[] = []
      for (let i = 1; i <= transaction.numberInstallments; i++) {
        const newTransaction: CreateTransactionsType = {
          ...transaction,
          id: randomUUID(),
          currentInstallment: i,
          date: addMonths(parseISO(transaction.date), i).toString(),
        }
        const transactionValidated = transactionsSchema.parse(newTransaction)
        transactions.push(transactionValidated)
      }
      const sqsRepository = new SQSRepository()

      for (const transaction of transactions) {
        await this.repository.create(transaction)
        await sqsRepository.send(transaction)
      }
    } catch (error) {
      console.error(error)
      throw new AppErrorException(400, 'Erro inesperado, tente novamente mais tarde!')
    }
  }
}
