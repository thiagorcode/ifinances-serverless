import { UsersTypes } from '../../shared/types'

export interface UserRepositoryInterface {
  findUserByBotUsername(userTelegram: string): Promise<UsersTypes | null>
}
