import { DynamoDB } from 'aws-sdk';
import { Database } from '../shared/database';
import { ReportsTransactionsRepositoryInterface } from './interface/reportsTransactionsRepository.interface';
import { ReportsMonthlyTypes } from '../types';
import {
  CreateReportMonthlyType,
  FindReportMonthlyTypes,
  UpdateExpenseValueMonthlyType,
  UpdateRecipeValueMonthlyType,
} from './types';
// TODO: SEPARAR AS CLASSES do repositório - Padrão refraction
export class ReportsTransactionsMonthly
  implements ReportsTransactionsRepositoryInterface
{
  private readonly database: DynamoDB.DocumentClient;
  private readonly TableName: string;
  constructor() {
    this.database = new Database().dynamoDb;
    this.TableName = 'finances-reports-transactions-monthly';
  }

  async find({
    year,
    yearMonth,
    userId,
  }: FindReportMonthlyTypes): Promise<ReportsMonthlyTypes | undefined> {
    const params = {
      TableName: this.TableName,
      Key: { year, yearMonth, userId },
    };
    const { Item } = await this.database.get(params).promise();

    return Item as ReportsMonthlyTypes | undefined;
  }

  async updateRecipeValue(
    id: string,
    currentReport: UpdateRecipeValueMonthlyType
  ): Promise<void> {
    const params: DynamoDB.DocumentClient.UpdateItemInput = {
      TableName: this.TableName, // Substitua pelo nome correto da tabela
      Key: { id },
      UpdateExpression:
        'SET recipeValue = :recipeValue, total = :total, dtUpdated = :dtUpdated',
      ExpressionAttributeValues: {
        ':recipeValue': currentReport.recipeValue,
        ':total': currentReport.total,
        ':dtUpdated': new Date().toISOString(),
      },
    };
    this.database.update(params).promise();
  }

  async updateExpenseValue(
    id: string,
    currentReport: UpdateExpenseValueMonthlyType
  ): Promise<void> {
    const params: DynamoDB.DocumentClient.UpdateItemInput = {
      TableName: this.TableName, // Substitua pelo nome correto da tabela
      Key: { id },
      UpdateExpression:
        'SET expenseValue = :expenseValue, total = :total, dtUpdated = :dtUpdated',
      ExpressionAttributeValues: {
        ':expenseValue': currentReport.expenseValue,
        ':total': currentReport.total,
        ':dtUpdated': new Date().toISOString(),
      },
    };
    this.database.update(params).promise();
  }
  create(reportMonthly: CreateReportMonthlyType): void {
    this.database
      .put({
        TableName: this.TableName,
        Item: reportMonthly,
      })
      .promise();
  }
}
