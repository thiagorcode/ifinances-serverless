import { TransactionCardRepositoryInterface } from '../repository/interface/transactionCardRepository.interface'
import { AppErrorException } from '../utils'

export class FindAllCore {
  constructor(private repository: TransactionCardRepositoryInterface) {}

  async execute({ categoryId, date, isPaid, type, userId }: any) {
    console.info('init findAll service')
    const query = { userId, categoryId, date, isPaid, type }
    console.log(this.repository)
    try {
      console.log('FindAll paths', query)

      return {}
    } catch (error) {
      console.error(error)
      throw new AppErrorException(400, 'Erro inesperado, tente novamente mais tarde!')
    }
  }
}
