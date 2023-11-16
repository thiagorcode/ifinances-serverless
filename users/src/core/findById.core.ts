import DynamoDBRepositoryInterface from '../repository/interface/dynamodbRepository.interface'
import { AppErrorException } from '../utils'

// TODO: Aplicar injenção de depedências
export class FindByIdCore {
  constructor(private dataRepository: DynamoDBRepositoryInterface) {}

  async execute(id?: string) {
    console.info('init finduser service')
    try {
      if (!id) {
        throw new AppErrorException(400, 'Não foi enviado o parâmetro ID!')
      }
      return await this.dataRepository.findById(id)
    } catch (error) {
      console.error(error)
      throw new AppErrorException(400, 'Erro inesperado, tente novamente mais tarde!')
    }
  }
}
