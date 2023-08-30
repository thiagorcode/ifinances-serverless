import 'reflect-metadata';
import { TransactionTypesEnum } from '../enums';
import { injectable, inject } from 'tsyringe';
import { ReportsTransactionsRepositoryInterface } from '../repository/interface/reportsTransactionsRepository.interface';
import { createReportMonthlySchema } from '../repository/schemas';
import {
  CreateReportMonthlyType,
  UpdateExpenseValueMonthlyType,
  UpdateRecipeValueMonthlyType,
} from '../repository/types';
import { TransactionsTypes } from '../types';
import {
  calculateNewExpenseValue,
  calculateNewRecipeValue,
  calculateNewTotalValue,
} from '../utils/calculateNewValues';

@injectable()
export class InsertReportMonthlyService {
  constructor(
    @inject('ReportsTransactionsMonthly')
    private reportsTransactionsRepository: ReportsTransactionsRepositoryInterface
  ) {}

  async execute(transaction: TransactionsTypes) {
    console.log(`Service InsertReportMonthly`);
    try {
      const reportMonthly = await this.reportsTransactionsRepository.find({
        year: transaction.year,
        yearMonth: transaction.yearMonth,
        userId: transaction.userId,
      });
      const { type, value } = transaction;

      if (!reportMonthly) {
        // TODO: Object - > Refatorar para gerar variável em outro lugar.
        // criar outro service para create
        console.info('execute create');
        const report: CreateReportMonthlyType = {
          recipeValue: calculateNewRecipeValue(type, 0, value),
          expenseValue: calculateNewExpenseValue(type, 0, value),
          total: calculateNewTotalValue(type, 0, value),
          year: transaction.year,
          yearMonth: transaction.yearMonth,
          userId: transaction.userId,
        };
        const reportValidateSchema = createReportMonthlySchema.parse({
          report,
        });
        this.reportsTransactionsRepository.create(reportValidateSchema);
        return;
      }
      if (type === TransactionTypesEnum.RECIPE) {
        const updateReportMonthly: UpdateRecipeValueMonthlyType = {
          recipeValue: calculateNewRecipeValue(
            type,
            reportMonthly.recipeValue,
            value
          ),
          total: calculateNewTotalValue(type, reportMonthly.total, value),
        };
        //TODO: Adiciona schema validate

        await this.reportsTransactionsRepository.updateRecipeValue(
          reportMonthly.id,
          updateReportMonthly
        );
        return;
      }
      if (type === TransactionTypesEnum.EXPENSE) {
        const updateReportMonthly: UpdateExpenseValueMonthlyType = {
          expenseValue: calculateNewExpenseValue(
            type,
            reportMonthly.recipeValue,
            value
          ),
          total: calculateNewTotalValue(type, reportMonthly.total, value),
        };
        //TODO: Adicionar schema validate
        await this.reportsTransactionsRepository.updateExpenseValue(
          reportMonthly.id,
          updateReportMonthly
        );
        return;
      }
      console.log();
      return;
    } catch (error) {
      console.error(error);
    }
  }
}
