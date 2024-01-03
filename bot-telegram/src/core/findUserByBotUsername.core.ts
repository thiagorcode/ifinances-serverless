import { UserRepositoryInterface } from '../repository/interface/userRepository.interface'

export class FindUserByBotUsernameCore {
  constructor(private userRepository: UserRepositoryInterface) {}

  async execute(userTelegram: string) {
    console.info('call FindUserByBotUsernameCore')
    return await this.userRepository.findUserByBotUsername(userTelegram)
  }
}
