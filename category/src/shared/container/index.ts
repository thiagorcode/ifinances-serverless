import { container } from 'tsyringe';
import UsersRepositoryProps from '@/repository/interface/users.repository.interface';
import { UsersRepository } from '@/repository/users.repository';

container.registerSingleton<UsersRepositoryProps>('UsersRepository', UsersRepository);
