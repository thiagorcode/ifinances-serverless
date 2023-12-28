import DynamoDBRepositoryInterface from '../repository/interface/dynamodbRepository.interface'
import { AppErrorException } from '../utils'

// TODO: Aplicar injenção de depedências
export class FindAllCore {
  constructor(private repository: DynamoDBRepositoryInterface) {}

  async execute() {
    console.info('init FindAllCategory service')
    try {
      return await this.repository.findAll()
    } catch (error) {
      throw new AppErrorException(400, 'Erro inesperado, tente novamente mais tarde!')
    }
  }
}
