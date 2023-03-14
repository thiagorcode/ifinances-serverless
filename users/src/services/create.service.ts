import { UsersTypes } from './../repository/types/users.types';
import 'reflect-metadata';
import { injectable, container, inject } from 'tsyringe';
import UsersRepository from '../repository/interface/users.repository.interface';
@injectable()
class Create {
  constructor(
    @inject('UsersRepository') private usersRepository: UsersRepository
  ) {}

  async execute(user: UsersTypes) {
    console.info('create service', user);
    return this.usersRepository.createUser(user);
  }
}

export const createService = () => {
  const service = container.resolve(Create);
  return service;
};
