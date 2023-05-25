import { injectable, inject } from 'tsyringe';
import { AppErrorException } from '../utils/appErrorException';
import { usersSchema } from './../repository/schemas/users.schema';
import { UsersTypes } from './../repository/types/users.types';
import UsersRepository from '../repository/interface/users.repository.interface';
@injectable()
export class CreateUserService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: UsersRepository
  ) {}

  async execute(user: UsersTypes) {
    console.info('create service');
    try {
      const userValidate = usersSchema.parse(user);
      return this.usersRepository.createUser(userValidate);
    } catch (error) {
      throw new AppErrorException(400, 'Erro no envio dos dados!@');
    }
  }
}
