import * as z from 'zod';
import { findAllWithQuerySchema } from '../schemas';

export type FindAllWithQueryOriginDto = {
  categoryId: string | undefined;
  date: string | undefined;
  type: string | undefined;
  isPaid: string | undefined;
};

export type FindAllWithQueryServiceDto = FindAllWithQueryOriginDto & {
  userId: string;
};

export type FindAllWithQueryDto = z.infer<typeof findAllWithQuerySchema>;
