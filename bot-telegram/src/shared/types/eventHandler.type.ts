import { UsersTypes } from './users.type'

export type EventHandlerType = {
  chatId: string
  user: UsersTypes
  attributes: string[]
}
