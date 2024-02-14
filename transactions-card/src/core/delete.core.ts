import TransactionRepositoryInterface from '../repository/interface/transactionRepository.interface'
import { AppErrorException } from '../utils'

export class DeleteCore {
  constructor(private repository: TransactionRepositoryInterface) {}

  async execute(transactionId: string) {
    console.info('init delete service')
    try {
      await this.repository.delete(transactionId)
    } catch (error) {
      console.error(error)
      throw new AppErrorException(400, 'Erro inesperado, tente novamente mais tarde!')
    }
  }
}
