import { UsersTypes } from '../shared/types'
import { AppErrorException } from '../utils'
import { messages } from '../shared/constants/messages'
import { CreateTransactionTelegramType } from '../shared/types/createTransactionFromTelegram.type'

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
    const installments = type === '-' && this.attributes[5] ? this.attributes[5].split('/') : []
    const transaction: CreateTransactionTelegramType = {
      date: this.attributes[0],
      categoryName: this.attributes[1],
      value: this.attributes[2],
      description: this.attributes[3] ?? '',
      cardName: type === '-' ? this.attributes[4] ?? null : null,
      currentInstallment: installments.length ? Number(installments[0]) : 0,
      finalInstallments: installments.length ? Number(installments[1]) : 0,
      userId: user.userId,
      type: type,
      originCreate: 'telegram',
    }
    console.log('transaction', transaction)
    return transaction
  }
}
