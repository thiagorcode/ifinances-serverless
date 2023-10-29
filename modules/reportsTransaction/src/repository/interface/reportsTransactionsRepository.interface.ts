import { ReportsMonthlyTypes } from '../../types';
import {
  CreateReportMonthlyType,
  FindReportMonthlyTypes,
  UpdateExpenseValueMonthlyType,
  UpdateRecipeValueMonthlyType,
} from '../types';

export interface ReportsTransactionsRepositoryInterface {
  find(params: FindReportMonthlyTypes): Promise<ReportsMonthlyTypes | null>;
  create(reportMonthly: CreateReportMonthlyType): void;
  updateRecipeValue(
    id: string,
    currentReport: UpdateRecipeValueMonthlyType
  ): Promise<void>;
  updateExpenseValue(
    id: string,
    currentReport: UpdateExpenseValueMonthlyType
  ): Promise<void>;
}
