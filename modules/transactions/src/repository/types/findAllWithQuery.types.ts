import * as z from 'zod';
import { findAllWithQuerySchema } from '../schemas';

export type FindAllWithQueryDto = z.infer<typeof findAllWithQuerySchema>;
