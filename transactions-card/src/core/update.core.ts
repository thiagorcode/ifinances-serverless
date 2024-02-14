import { UpdateTransactionsCardType } from '../shared/types'
import TransactionRepositoryInterface from '../repository/interface/transactionCardRepository.interface'
import { AppErrorException } from '../utils'
import { transactionsCardSchema } from '../shared/schemas'

export class UpdateCore {
  constructor(private repository: TransactionRepositoryInterface) {}

  async execute(transaction: UpdateTransactionsCardType) {
    console.info('init update service')
    try {
      const transactionParsed = transactionsCardSchema.parse(transaction)

      await this.repository.update(transactionParsed.id ?? '', transactionParsed)
    } catch (error) {
      console.error(error)
      throw new AppErrorException(400, 'Erro inesperado, tente novamente mais tarde!')
    }
  }
}
