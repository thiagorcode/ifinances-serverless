import { FindAllWithQueryType } from 'src/shared/types'
import TransactionRepositoryInterface from '../repository/interface/transactionRepository.interface'
import { AppErrorException } from '../utils'
import { findAllWithQuerySchema } from '../shared/schemas'
import { totalizersValue } from '../utils/totalizersValue'

export class FindAllCore {
  constructor(private repository: TransactionRepositoryInterface) {}

  async execute({ categoryId, date, isPaid, type, userId }: FindAllWithQueryType) {
    console.info('init findAll service')
    const query = { userId, categoryId, date, isPaid, type }

    try {
      console.log('FindAll paths', query)
      const validatedQuery = findAllWithQuerySchema.parse(query)
      // TODO: Precisamos adicionar um redis
      const transactions = await this.repository.findAllWithQuery(validatedQuery)
      const totalizers = totalizersValue(transactions)

      return {
        totalizers,
        ...transactions,
      }
    } catch (error) {
      console.error(error)
      throw new AppErrorException(400, 'Erro inesperado, tente novamente mais tarde!')
    }
  }
}
