import * as z from 'zod';
import { transactionsSchema } from '../schemas';

export type CreateTransactionsDto = z.infer<typeof transactionsSchema>;
