import { UsersTypes } from './users.type'

export type EventCreateTransactionByChatType = {
  chatId: string
  user: UsersTypes
  attributes: string[]
  type: '+' | '-'
}
