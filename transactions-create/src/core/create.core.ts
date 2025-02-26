import { CreateTransactionsType } from '../shared/types'
import TransactionRepositoryInterface from '../repository/interface/transactionRepository.interface'
import { AppErrorException } from '../utils'
import { transactionsSchema } from '../shared/schemas'
import { randomUUID } from 'crypto'
import { addMonths, parseISO } from 'date-fns'

export class CreateCore {
  constructor(private repository: TransactionRepositoryInterface) {}

  private async createInstallmentTransaction(transaction: CreateTransactionsType) {
    console.info('init createInstallmentTransaction service')

    const qtdInstallments = transaction.finalInstallments - transaction.currentInstallment
    const transactions: CreateTransactionsType[] = []
    for (let i = 1; i <= qtdInstallments; i++) {
      const newTransaction: CreateTransactionsType = {
        ...transaction,
        id: randomUUID(),
        isInstallments: true,
        isPaid: false,
        currentInstallment: transaction.currentInstallment + i,
        date: addMonths(parseISO(transaction.date), i).toISOString(),
      }
      const transactionValidated = transactionsSchema.parse(newTransaction)
      transactions.push(transactionValidated)
    }

    await Promise.all(transactions.map((t) => this.repository.create(t)))
  }
  async execute(transaction: CreateTransactionsType) {
    console.info('init create service')
    try {
      const isInstallments = !!transaction.finalInstallments && !!transaction.currentInstallment
      const transactionParsed = transactionsSchema.parse({ ...transaction, id: randomUUID(), isInstallments })

      await this.repository.create(transactionParsed)
      // Criar um evento para criar
      // Refatorar a lógica
      if (isInstallments) {
        await this.createInstallmentTransaction(transactionParsed)
      }

      console.info('-------- TRANSACTION CREATED -------')
    } catch (error) {
      console.error(error)
      throw new AppErrorException(400, 'Erro inesperado, tente novamente mais tarde!')
    }
  }
}
