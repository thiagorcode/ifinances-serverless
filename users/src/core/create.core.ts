import { usersSchema } from '../shared/schemas'
import DynamoDBRepositoryInterface from '../repository/interface/usersRepository.interface'
import { UsersTypes } from '../shared/types'

// TODO: Aplicar injenção de depedências
export class CreateCore {
  constructor(private userRepository: DynamoDBRepositoryInterface) {}

  async execute(user: UsersTypes | null) {
    console.info('init create service')

    const userValidate = usersSchema.parse(user)
    return await this.userRepository.createUser(userValidate)
  }
}
