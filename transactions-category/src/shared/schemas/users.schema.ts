import * as z from 'zod'

export const usersSchema = z.object({
  id: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  username: z.string(),
  email: z.string(),
  password: z.string().optional(), // Por enquanto
  isActive: z.boolean().default(true),
  isPasswordChange: z.boolean().default(false),
  dtCreated: z.date().default(new Date()),
  dtUpdated: z.date().default(new Date()),
})
