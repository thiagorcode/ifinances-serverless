import * as z from 'zod';
import { transactionsSchema } from '../schemas';

export type UpdateTransactionsDto = z.infer<typeof transactionsSchema>;
