import * as z from 'zod'
import { transactionsSchema } from '../schemas'

export type UpdateTransactionsType = z.infer<typeof transactionsSchema>
