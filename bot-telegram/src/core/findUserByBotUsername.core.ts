import { UsersTypes } from '../shared/types'
import { UserRepositoryInterface } from '../repository/interface/userRepository.interface'
import { AppErrorException } from '../utils'
import { messages } from '../shared/constants/messages'

export class FindUserByBotUsernameCore {
  constructor(private userRepository: UserRepositoryInterface) {}

  async execute(userTelegram: string): Promise<UsersTypes | null> {
    console.info('call FindUserByBotUsernameCore')
    const user = await this.userRepository.findUserByBotUsername(userTelegram)

    return user
  }
}
