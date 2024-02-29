import { UsersBotTypes } from '../../shared/types'

export interface UserBotRepositoryInterface {
  findAllUsers(): Promise<UsersBotTypes[]>
}
