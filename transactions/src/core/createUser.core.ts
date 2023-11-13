import { usersSchema } from '../shared/schemas'
import DynamoDBRepositoryInterface from '../repository/interface/dynamodbRepository.interface'
import { UsersTypes } from '../shared/types'
import { AppErrorException } from '../utils'

// TODO: Aplicar injenção de depedências
export class CreateUserCore {
  constructor(private dataRepository: DynamoDBRepositoryInterface) {}

  async execute(user: UsersTypes | null) {
    console.info('create service')
    try {
      const userValidate = usersSchema.parse(user)
      return this.dataRepository.createUser(userValidate)
    } catch (error) {
      throw new AppErrorException(400, 'Erro inesperado, tente novamente mais tarde!')
    }
  }
}
