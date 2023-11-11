import DynamoDBRepositoryInterface from '../repository/interface/dynamodbRepository.interface'
import { AppErrorException } from '../utils'

// TODO: Aplicar injenção de depedências
export class FindUsersCore {
  constructor(private dataRepository: DynamoDBRepositoryInterface) {}

  async execute() {
    console.info('init finduser service')
    try {
      return await this.dataRepository.findAll()
    } catch (error) {
      throw new AppErrorException(400, 'Erro inesperado, tente novamente mais tarde!')
    }
  }
}
