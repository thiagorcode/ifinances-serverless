import {  Repository } from 'typeorm';
import { Database } from "src/shared/database"
import { Users } from 'src/shared/database/entities/users.entity';

class UsersRepository {
  private usersRepository: Repository<Users>
 // Transformar em layer
  constructor(private database: Database) {}

  async initialize(): Promise<void> {
    if(!this.usersRepository){
      const connection    = await this.database.getConnection();
      this.usersRepository = connection.getRepository(Users)
    }
  }

  async findByUserId(userId: string): Promise<Users> {
    return this.usersRepository.findOneBy({
      id: userId
    })
  }

}

export const usersRepository = async (database: Database) => {
  const repository = new UsersRepository(database);
  await repository.initialize()
  return repository;
}