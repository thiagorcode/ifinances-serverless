import { CreateCardTransactionsType } from '../shared/types'
import { TransactionCardRepositoryInterface } from '../repository/interface/transactionCardRepository.interface'
import { AppErrorException } from '../utils'
import { transactionsCardSchema } from '../shared/schemas'

export class CreateCore {
  constructor(private repository: TransactionCardRepositoryInterface) {}

  async execute(card: CreateCardTransactionsType) {
    console.info('init create service')
    try {
      const cardParsed = transactionsCardSchema.parse(card)

      await this.repository.create(cardParsed)
    } catch (error) {
      console.error(error)
      throw new AppErrorException(400, 'Erro inesperado, tente novamente mais tarde!')
    }
  }
}
