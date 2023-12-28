import TransactionRepositoryInterface from '../repository/interface/transactionRepository.interface'
import { AppErrorException } from '../utils'

// TODO: Aplicar injenção de depedências
export class FindByUserIdCore {
  constructor(private repository: TransactionRepositoryInterface) {}

  async execute(userId: string) {
    console.info('init findByUserId service')
    try {
      if (!userId) {
        throw new AppErrorException(400, 'Não foi enviado o parâmetro userId!')
      }
      return await this.repository.findByUserId(userId)
    } catch (error) {
      throw new AppErrorException(400, 'Erro inesperado, tente novamente mais tarde!')
    }
  }
}
