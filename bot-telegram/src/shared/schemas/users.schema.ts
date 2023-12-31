import * as crypto from 'crypto'
import * as z from 'zod'

export const usersSchema = z
  .object({
    id: z.string().default(crypto.randomUUID()),
    firstName: z.string(),
    lastName: z.string(),
    username: z.string(),
    email: z.string(),
    password: z.string(),
    isActive: z.boolean().default(true),
    isPasswordChange: z.boolean().default(false),
    dtCreated: z.string().default(new Date().toISOString()),
    dtUpdated: z.string().default(new Date().toISOString()),
  })
  .transform((data) => {
    const salt = crypto.randomBytes(16).toString('hex')
    return {
      ...data,
      salt,
      password: crypto.pbkdf2Sync(data.password, salt, 1000, 64, 'sha512').toString('hex'),
    }
  })
