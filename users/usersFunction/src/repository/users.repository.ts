import { Repository } from 'typeorm';
import { Database } from '@shared/database';
import { Users } from '@shared/database/entities/users.entity';
import UsersRepositoryProps from './interface/users.repository.interface';

export class UsersRepository implements UsersRepositoryProps {
  // Transformar em layer

  async findByUserId(userId: string): Promise<Users | null> {
    const connection = new Database();
    await connection.createConnection();
    const usersRepository = connection.dataSource.getRepository(Users);
    return usersRepository.findOne({
      where: {
        id: userId,
      },
    });
  }
}
