import { Database } from 'src/shared/database';
import { usersRepository } from "src/repository/users.repository"
import UsersRepository from "src/repository/users.repository.dto"

class UsersService {
  // TODO:Apply inject dependency
  // https://itnext.io/ahaless-write-serverless-application-oop-on-top-of-typescript-ffbab8e5c4db
  private usersRepository: UsersRepository;
  
  constructor(private database: Database) {}

  async initialize(): Promise<void> {
    this.usersRepository = await usersRepository(this.database);
  }

  async findByUserId(userId: string) {
    return this.usersRepository.findByUserId(userId)
  }

  create() {}

  update() {}

  remove() {}
}

export const usersService = async (database: Database) =>{
  const service = new UsersService(database)
  await service.initialize()
  return service;
}