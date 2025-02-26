import destr from 'destr'
import { FindAllWithQueryOriginType } from '../shared/types'
import TransactionRepositoryInterface from '../repository/interface/transactionRepository.interface'
import { AppErrorException } from '../utils'
import { findAllWithQuerySchema } from '../shared/schemas'
import { totalizersValue } from '../utils/totalizersValue'
import { RedisRepository } from '../repository/redis.repository'

const EXPIRE_TIME = 60 * 10 // 10 minutos

export class FindAllCore {
  constructor(private repository: TransactionRepositoryInterface) {}

  async execute(userId: string, queryParams: FindAllWithQueryOriginType) {
    console.info('init findAll service')
    const { categoryId, startDate, endDate, isPaid, type, cardId, yearMonth } = queryParams
    const isFilterAdditional = !!categoryId || !!startDate || !!endDate || !!isPaid || !!cardId || !!type
    try {
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

      // TODO: Aplicar injeção de depedencia - Apenas Testes
      const redisClient = await RedisRepository.connect()

      if (!isFilterAdditional) {
        const cacheTransactions = await redisClient.get(`find-all-query-${userId}-${yearMonth}`)
        if (cacheTransactions) {
          return destr(cacheTransactions)
        }
      }

      const transactions = await this.repository.findAllWithQuery(validatedQuery)
      const totalizers = totalizersValue(transactions)

      const response = {
        totalizers,
        transactions,
      }
      if (!isFilterAdditional && response.transactions.length !== 0) {
        await redisClient.set(`find-all-query-${userId}-${yearMonth}`, JSON.stringify(response), { EX: EXPIRE_TIME })
      }

      return response
    } catch (error) {
      console.error(error)
      throw new AppErrorException(400, 'Erro inesperado, tente novamente mais tarde!')
    }
  }
}
