import * as z from 'zod'
import { findAllWithQuerySchema } from '../schemas'

export type FindAllWithQueryOriginType = {
  categoryId?: string
  startDate?: string
  endDate?: string
  type?: string
  cardId?: string
  isPaid?: boolean
  yearMonth?: string
}

// TODO: REFACTOR changed name
export type FindAllWithQueryType = z.infer<typeof findAllWithQuerySchema>
