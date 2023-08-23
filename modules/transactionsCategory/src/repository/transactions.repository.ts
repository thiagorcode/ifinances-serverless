import { DynamoDB } from 'aws-sdk';
import { addMonths, parseISO } from 'date-fns';
import { v4 as uuid } from 'uuid';
import { Database } from '../shared/database';
import { TransactionsCategoryRepositoryInterface } from './interface/transactions.repository.interface';
import { TransactionsCategoryTypes } from './types';

export class TransactionsCategoryRepository
  implements TransactionsCategoryRepositoryInterface
{
  private readonly database: DynamoDB.DocumentClient;
  private readonly TableName: string;
  constructor() {
    this.database = new Database().dynamoDb;
    this.TableName = 'finances-transactionsCategory';
  }

  async findAll(): Promise<TransactionsCategoryTypes> {
    const params = {
      TableName: this.TableName,
      Key: {},
    };
    const { Item } = await this.database.get(params).promise();

    return Item as TransactionsCategoryTypes;
  }
}
