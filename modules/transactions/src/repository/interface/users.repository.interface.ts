import { UsersTypes } from '../types';

export default interface UsersRepositoryInterface {
  findByUserId(userId: string): Promise<UsersTypes | undefined>;
  createUser(user: UsersTypes): Promise<UsersTypes>;
}
