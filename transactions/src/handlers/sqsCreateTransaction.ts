import { SQSEvent } from 'aws-lambda'
import { CreateTransactionsType } from '../shared/types'
import { destr } from 'destr'
import { TransactionRepository } from '../repository/transactions.repository'
import { CreateCore } from '../core/create.core'

export const handler = async (event: SQSEvent): Promise<PromiseSettledResult<void>[]> => {
  const repository = new TransactionRepository()
  const createTransactionCore = new CreateCore(repository)

  const recordPromises = event.Records.map(async (record) => {
    console.log(`MessageId: ${record.messageId} `)
    console.log(`Record: ${JSON.stringify(record)} `)
    // usar outra coisa sem ser JSON.parse

    const body = destr<CreateTransactionsType>(record.body)
    console.log(`Body: ${JSON.stringify(body)} `)

    await createTransactionCore.execute(body)
  })
  const resultPromises = await Promise.allSettled(recordPromises)
  console.debug('resultPromises: ', resultPromises)

  return resultPromises
}
