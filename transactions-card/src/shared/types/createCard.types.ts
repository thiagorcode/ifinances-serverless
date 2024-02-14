import * as z from 'zod'
import { transactionsCardSchema } from '../schemas'

export type CreateCardTransactionsType = z.infer<typeof transactionsCardSchema>
