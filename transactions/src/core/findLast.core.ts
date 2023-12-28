import TransactionRepositoryInterface from '../repository/interface/transactionRepository.interface'
import { AppErrorException } from '../utils'

export class FindLastCore {
  constructor(private repository: TransactionRepositoryInterface) {}

  async execute(userId: string) {
    console.info('init find service')
    try {
      return await this.repository.findByUserId(userId)
    } catch (error) {
      console.error(error)
      throw new AppErrorException(400, 'Erro inesperado, tente novamente mais tarde!')
    }
  }
}
