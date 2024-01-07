import { destr } from 'destr'
import { APIGatewayProxyEvent, Callback, Context } from 'aws-lambda'
import { EventTelegramType } from '../shared/types'
import { UserRepository } from '../repository/user.repository'
import { AppErrorException, extractTextFromEvent } from '../utils'
import {
  CreateTransactionQueueCore,
  FindUserByBotUsernameCore,
  ProcessMessageCore,
  SendMessageTelegramCore,
} from '../core'
import { messages } from '../shared/constants/messages'
import { SQSRepository } from '../repository/sqs.repository'
import { TransactionCategoryRepository } from '../repository/transactionCategory.repository'
import { TransactionCardRepository } from '../repository/transactionCard.repository'

export const handler = async (event: APIGatewayProxyEvent, context: Context, callback: Callback) => {
  console.info('Event:', event)
  const body = destr<EventTelegramType>(event.body)
  console.info('Body:', body)
  const { chatId, message } = extractTextFromEvent(body)
  // Repository
  const userRepository = new UserRepository()
  const sqsRepository = new SQSRepository()
  const transactionCategoryRepository = new TransactionCategoryRepository()
  const transactionCardRepository = new TransactionCardRepository()
  // Core
  const sendMessageTelegramCore = new SendMessageTelegramCore(chatId)
  const findUserByBotUsernameCore = new FindUserByBotUsernameCore(userRepository)
  const processMessageCore = new ProcessMessageCore()
  const createTransactionQueueCore = new CreateTransactionQueueCore(
    sqsRepository,
    transactionCategoryRepository,
    transactionCardRepository,
  )

  try {
    const user = await findUserByBotUsernameCore.execute(body.message.chat.username)
    console.info('user', user)
    const messageAttribute = await processMessageCore.execute({
      message,
      user,
    })
    await createTransactionQueueCore.execute(messageAttribute.transaction)
    await sendMessageTelegramCore.execute(messages.transaction_success)

    return callback(null)
  } catch (error) {
    if (error instanceof AppErrorException) {
      await sendMessageTelegramCore.execute(error.message)

      return callback('invalid')
    }
    await sendMessageTelegramCore.execute(messages['1'])
    return callback('invalid')
  }
}
