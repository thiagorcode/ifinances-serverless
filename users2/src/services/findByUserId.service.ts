import 'reflect-metadata';
import { injectable, container, inject } from 'tsyringe';
import UsersRepository from '../repository/interface/users.repository.interface';
@injectable()
class FindByUserId {
  constructor(@inject('UsersRepository') private usersRepository: UsersRepository) {}

  async execute(userId: string) {
    console.log('service', userId);
    return this.usersRepository.findByUserId(userId);
  }
}

export const findByUserIdService = () => {
  const service = container.resolve(FindByUserId);
  return service;
};
