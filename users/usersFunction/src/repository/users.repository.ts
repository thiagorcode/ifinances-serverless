import { Repository } from 'typeorm';
import { Database } from '@shared/database';
import { Users } from '@shared/database/entities/users.entity';
import UsersRepositoryProps from './interface/users.repository.interface';

export class UsersRepository implements UsersRepositoryProps {
  // Transformar em layer
  private usersRepository: Repository<Users>;

  constructor() {
    const connection = new Database();
    this.usersRepository = connection.dataSource.getRepository(Users);
  }

  async findByUserId(userId: string): Promise<Users | null> {
    return this.usersRepository.findOneBy({
      id: userId,
    });
  }
}
