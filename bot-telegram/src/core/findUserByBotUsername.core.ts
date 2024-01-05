import { UsersTypes } from '../shared/types'
import { UserRepositoryInterface } from '../repository/interface/userRepository.interface'
import { AppErrorException } from '../utils'
import { errorMessages } from '../shared/constants/errorMessages'

export class FindUserByBotUsernameCore {
  constructor(private userRepository: UserRepositoryInterface) {}

  async execute(userTelegram: string): Promise<UsersTypes> {
    console.info('call FindUserByBotUsernameCore')
    const user = await this.userRepository.findUserByBotUsername(userTelegram)

    if (!user) {
      throw new AppErrorException(400, errorMessages.user_not_found)
    }

    return user
  }
}
