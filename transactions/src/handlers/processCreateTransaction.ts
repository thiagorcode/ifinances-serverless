// import destr from 'destr'
import { CreateTransactionsType } from '../shared/types'
import { TransactionRepository } from '../repository/transactions.repository'
import { CreateCore } from '../core/create.core'
import { EventBridgeEvent } from 'aws-lambda'
export const handler = async (event: EventBridgeEvent<'TRANSACTION_CREATE', CreateTransactionsType>) => {
  console.log(`event: ${JSON.stringify(event)} `)

  const repository = new TransactionRepository()
  const createTransactionCore = new CreateCore(repository)

  // usar outra coisa sem ser JSON.parse

  const body = event.detail

  await createTransactionCore.execute(body)

  return true
}
