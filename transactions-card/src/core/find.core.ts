import TransactionRepositoryInterface from '../repository/interface/transactionCardRepository.interface'
import { AppErrorException } from '../utils'

// TODO: Aplicar injenção de depedências
export class FindCore {
  constructor(private repository: TransactionRepositoryInterface) {}

  async execute(id: string) {
    console.info('init find service')
    try {
      return await this.repository.find(id)
    } catch (error) {
      console.error(error)
      throw new AppErrorException(400, 'Erro inesperado, tente novamente mais tarde!')
    }
  }
}
