import { container } from 'tsyringe';
import UsersRepositoryProps from 'src/repository/interface/users.repository.interface';
import { UsersRepository } from 'src/repository/users.repository';

container.registerSingleton<UsersRepositoryProps>('UsersRepository', UsersRepository);
