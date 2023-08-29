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
    this.TableName = 'finances-transactions-category';
  }

  async findAll(): Promise<TransactionsCategoryTypes[] | undefined> {
    const params = {
      TableName: this.TableName,
      Key: {},
    };
    const { Items } = await this.database.scan(params).promise();

    return Items as TransactionsCategoryTypes[] | undefined;
  }
  async find(id: string): Promise<TransactionsCategoryTypes> {
    const params = {
      TableName: this.TableName,
      Key: { id },
    };
    const { Item } = await this.database.get(params).promise();

    return Item as TransactionsCategoryTypes;
  }
}
