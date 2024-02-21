import { createTransactionFromTelegramSchema } from '../shared/schemas'
import { CreateTransactionTelegramType } from '../shared/types/createTransactionFromTelegram.type'
import { AppErrorException } from '../utils'
import { messages } from '../shared/constants/messages'
import { TransactionCategoryRepositoryInterface } from '../repository/interface/transactionCategory.interface'
import { TransactionCardRepository } from '../repository/transactionCard.repository'
import { EventBridgeRepository } from '../repository/eventBridge.repository'

export class CreateTransactionQueueCore {
  constructor(
    private eventBridgeRepository: EventBridgeRepository,
    private transactionCategoryRepository: TransactionCategoryRepositoryInterface,
    private transactionCardRepository: TransactionCardRepository,
  ) {}
  // TODO: Refactor
  private async filterCategory(transactionType: string, categoryName: string) {
    const listCategory = await this.transactionCategoryRepository.findAll()

    const listCategoryByType = listCategory.filter((category) => category.type === transactionType)
    const categorySelected = listCategoryByType.find(
      (category) => category.name.toLowerCase() === categoryName.toLowerCase(),
    )

    if (!categorySelected) {
      const listCategoryMessage = listCategoryByType.map((category) => category.name)
      let errorMessageWithListCategory = messages.transactions.category_invalid
      listCategoryMessage.forEach((category) => {
        errorMessageWithListCategory += `${category} \n`
      })
      console.error('error message', errorMessageWithListCategory)
      throw new AppErrorException(400, errorMessageWithListCategory)
    }
    return categorySelected
  }

  private async filterCard(cardName: string, userId: string) {
    if (!cardName) return undefined
    const listCard = await this.transactionCardRepository.findByUserId(userId)

    const cardSelected = listCard.find((card) => card.name.toLowerCase() === cardName.toLowerCase())

    if (!cardSelected) {
      const listCardMessage = listCard.map((card) => card.name)
      let errorMessageListCard = messages.transactions.card_invalid
      listCardMessage.forEach((card) => {
        errorMessageListCard += `${card} \n`
      })
      console.error('error message', errorMessageListCard)

      throw new AppErrorException(400, errorMessageListCard)
    }
    return cardSelected
  }

  private validDate(dateString: string) {
    try {
      const partDate = dateString.split('/')
      return new Date(`${partDate[2]}-${partDate[1]}-${partDate[0]}`)
    } catch (error) {
      throw new AppErrorException(400, messages.transactions.date_invalid)
    }
  }

  async execute(transaction: CreateTransactionTelegramType) {
    const categorySelected = await this.filterCategory(transaction.type, transaction.categoryName)
    const cardSelected = await this.filterCard(transaction.cardName, transaction.userId)
    try {
      console.info('call CreateTransactionQueueCore')
      const newTransaction = {
        ...transaction,
        date: this.validDate(transaction.date),
        card: cardSelected,
        category: categorySelected,
      }

      const transactionParsed = createTransactionFromTelegramSchema.parse(newTransaction)
      console.log('transaction', transactionParsed)
      await this.eventBridgeRepository.push(
        transactionParsed,
        'lambda.transaction-event',
        process.env.BUS_TRANSACTIONS_NAME ?? '',
      )
      return
    } catch (error: any) {
      console.error(error)
      throw new AppErrorException(400, messages.transactions.invalid)
    }
  }
}
