import { UsersTypes } from './users.type'
import { SendMessageTelegramCore } from '../../core'

export type ProcessMessageType = {
  user: UsersTypes | null
  sendMessageTelegramCore: SendMessageTelegramCore
  message: string
}
