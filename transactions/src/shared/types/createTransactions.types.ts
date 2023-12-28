import * as z from 'zod'
import { transactionsSchema } from '../schemas'

export type CreateTransactionsType = z.infer<typeof transactionsSchema>
