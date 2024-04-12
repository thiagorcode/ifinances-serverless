import { FindAllWithQueryType } from '../shared/types'
import TransactionRepositoryInterface from '../repository/interface/transactionRepository.interface'
import { AppErrorException } from '../utils'
import { findAllWithQuerySchema } from '../shared/schemas'
import { totalizersValue } from '../utils/totalizersValue'

export class FindAllCore {
  constructor(private repository: TransactionRepositoryInterface) {}

  async execute(queryParams: FindAllWithQueryType) {
    console.info('init findAll service')
    const { userId, categoryId, startDate, endDate, isPaid, type, cardId, yearMonth } = queryParams

    try {
      console.log('FindAll paths', queryParams)
      const validatedQuery = findAllWithQuerySchema.parse({
        userId,
        categoryId,
        startDate,
        endDate,
        isPaid,
        type,
        cardId,
        yearMonth,
      })
      // TODO: Precisamos adicionar um redis
      const transactions = await this.repository.findAllWithQuery(validatedQuery)
      const totalizers = totalizersValue(transactions)

      return {
        totalizers,
        transactions,
      }
    } catch (error) {
      console.error(error)
      throw new AppErrorException(400, 'Erro inesperado, tente novamente mais tarde!')
    }
  }
}
