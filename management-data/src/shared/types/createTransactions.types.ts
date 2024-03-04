import * as z from 'zod'
import { TransactionsSchema } from '../schemas'

export type CreateTransactionsType = z.infer<typeof TransactionsSchema>
