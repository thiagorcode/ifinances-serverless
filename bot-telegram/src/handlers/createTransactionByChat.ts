import { Callback, Context } from 'aws-lambda'

import { EventCreateTransactionByChatType } from '../shared/types'
import { AppErrorException } from '../utils'
import { CreateTransactionQueueCore, SendMessageTelegramCore, ValidateTransactionCore } from '../core'
import { messages } from '../shared/constants/messages'
import { SQSRepository } from '../repository/sqs.repository'
import { TransactionCategoryRepository } from '../repository/transactionCategory.repository'
import { TransactionCardRepository } from '../repository/transactionCard.repository'

export const handler = async (event: EventCreateTransactionByChatType, context: Context, callback: Callback) => {
  console.info('Event:', event)
  const { chatId, attributes, user, type } = event
  // Repository
  const sqsRepository = new SQSRepository()
  const transactionCategoryRepository = new TransactionCategoryRepository()
  const transactionCardRepository = new TransactionCardRepository()
  // Core
  const sendMessageTelegramCore = new SendMessageTelegramCore(chatId)
  const createTransactionQueueCore = new CreateTransactionQueueCore(
    sqsRepository,
    transactionCategoryRepository,
    transactionCardRepository,
  )

  try {
    const validateTransactionCore = new ValidateTransactionCore(attributes)
    const transaction = validateTransactionCore.execute(user, type)

    await createTransactionQueueCore.execute(transaction)
    await sendMessageTelegramCore.execute(messages.transactions.success)

    return callback(null)
  } catch (error) {
    if (error instanceof AppErrorException) {
      await sendMessageTelegramCore.execute(error.message)

      return callback(null)
    }
    await sendMessageTelegramCore.execute(messages['1'])
    return callback(null)
  }
}
