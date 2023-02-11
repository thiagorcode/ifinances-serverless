import { Users } from '@shared/database/entities/users.entity';

export default interface UsersRepositoryProps {
  findByUserId(userId: string): Promise<Users | null>;
}
