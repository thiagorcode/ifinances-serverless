import { UsersTypes } from '../../shared/types'

export default interface DynamoDBRepositoryInterface {
  findById(id: string): Promise<UsersTypes | undefined>
  findByUsername(username: string): Promise<UsersTypes | null>
  findAll(): Promise<UsersTypes[]>
  createUser(user: UsersTypes): Promise<void>
}
