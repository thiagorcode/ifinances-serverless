import { usersSchema } from '../shared/schemas'
import DynamoDBRepositoryInterface from '../repository/interface/dynamodbRepository.interface'
import { UsersTypes } from '../shared/types'
import { AppErrorException } from '../utils'

// TODO: Aplicar injenção de depedências
export class CreateUserCore {
  constructor(private dataRepository: DynamoDBRepositoryInterface) {}

  async execute(user: UsersTypes | null) {
    console.info('init create service')

    const userValidate = usersSchema.parse(user)
    return await this.dataRepository.createUser(userValidate)
  }
}
