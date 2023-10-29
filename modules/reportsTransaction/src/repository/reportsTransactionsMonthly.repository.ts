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
    this.TableName = process.env.TABLE_DDB ?? '';
  }

  async find({
    year,
    yearMonth,
    userId,
  }: FindReportMonthlyTypes): Promise<ReportsMonthlyTypes | null> {
    try {
      console.log('find', {
        year,
        yearMonth,
        userId,
      });
      const params = {
        TableName: this.TableName,
        KeyConditionExpression:
          'year = :year AND yearMonth = :yearMonth AND userId = :userId',
        ExpressionAttributeValues: {
          ':year': year,
          ':yearMonth': yearMonth,
          ':userId': userId,
        },
      };
      console.log(params);

      console.log('database', await this.database.query(params).promise());

      const { Items } = await this.database.query(params).promise();
      console.log('Items', Items);
      if (!Items) {
        return null;
      }
      return Items[0] as ReportsMonthlyTypes;
    } catch (error) {
      console.log('error', error);
      return null;
    }
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
