import { UpdateTransactionsType } from '../shared/types'
import TransactionRepositoryInterface from '../repository/interface/transactionRepository.interface'
import { AppErrorException } from '../utils'
import { transactionsSchema } from '../shared/schemas'

export class UpdateCore {
  constructor(private repository: TransactionRepositoryInterface) {}

  async execute(transaction: UpdateTransactionsType) {
    console.info('init update service')
    try {
      const transactionParsed = transactionsSchema.parse(transaction)

      await this.repository.update(transactionParsed.id ?? '', transactionParsed)
    } catch (error) {
      console.error(error)
      throw new AppErrorException(400, 'Erro inesperado, tente novamente mais tarde!')
    }
  }
}
