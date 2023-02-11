import { Users } from 'usersFunction/src/shared/database/entities/users.entity';

export default interface UsersRepositoryProps {
  findByUserId(userId: string): Promise<Users | null>;
}
