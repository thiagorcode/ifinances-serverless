import { Users } from 'src/shared/database/entities/users.entity';

export default interface UserRepository {
  findByUserId(userId: string): Promise<Users>;
}
