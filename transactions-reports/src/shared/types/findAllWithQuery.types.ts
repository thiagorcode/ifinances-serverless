import * as z from 'zod'
import { findAllWithQuerySchema } from '../schemas'

export type FindAllWithQueryOriginType = {
  categoryId: string | undefined
  date: string | undefined
  type: string | undefined
  isPaid: boolean | undefined
}

export type FindAllWithQueryServiceDto = FindAllWithQueryOriginType & {
  userId: string
}
// TODO: REFACTOR changed name
export type FindAllWithQueryType = z.infer<typeof findAllWithQuerySchema>
