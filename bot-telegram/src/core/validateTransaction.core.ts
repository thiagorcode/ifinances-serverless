import { UsersTypes } from '../shared/types'
import { AppErrorException } from '../utils'
import { messages } from '../shared/constants/messages'

export class ValidateTransactionCore {
  private attributes: string[]
  constructor(attributes: string[]) {
    if (attributes.length < 3) {
      throw new AppErrorException(1, messages.transactions.invalid)
    }
    this.attributes = attributes
  }

  execute(user: UsersTypes, type: '+' | '-') {
    console.info('call validateTransaction core')

    const transaction = {
      date: this.attributes[0],
      categoryName: this.attributes[1],
      value: this.attributes[2],
      description: this.attributes[3] ?? '',
      cardName: this.attributes[4] ?? null,
      userId: user.userId,
      type: type,
      originCreate: 'telegram',
    }
    return transaction
  }
}
