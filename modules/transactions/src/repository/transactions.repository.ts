import { DynamoDB } from 'aws-sdk';
import { addMonths, parseISO } from 'date-fns';
import { v4 as uuid } from 'uuid';
import { Database } from '../shared/database';
import { TransactionsRepositoryInterface } from './interface/transactions.repository.interface';
import {
  CreateTransactionsDto,
  TransactionsTypes,
  FindAllWithQueryDto,
  UpdateTransactionsDto,
} from './types';

export class TransactionsRepository implements TransactionsRepositoryInterface {
  private readonly database: DynamoDB.DocumentClient;
  private readonly TableName: string;
  constructor() {
    this.database = new Database().dynamoDb;
    this.TableName = 'finances-transactions';
  }

  async findByUserId(userId: string): Promise<TransactionsTypes[]> {
    const params = {
      TableName: this.TableName,
      KeyConditionExpression: 'userId = :userId',
      ExpressionAttributeValues: {
        ':userId': userId,
      },
    };
    const { Items } = await this.database.query(params).promise();

    return Items as TransactionsTypes[];
  }

  async findAllWithQuery({
    categoryId,
    date,
    isPaid,
    type,
    userId,
  }: FindAllWithQueryDto): Promise<TransactionsTypes[]> {
    const params: DynamoDB.DocumentClient.QueryInput = {
      TableName: this.TableName, // Substitua pelo nome correto da tabela
      KeyConditionExpression: 'userId = :userId',
      ExpressionAttributeValues: {
        ':userId': userId,
      },
      ProjectionExpression:
        'id, #type, #date, userId, #value, isPaid, bank, #description, #categoryName, #categoryId',
      ExpressionAttributeNames: {
        '#type': 'type',
        '#date': 'date',
        '#value': 'value',
        '#description': 'description',
        '#categoryName': 'category.name',
        '#categoryId': 'category.id',
      },
      ScanIndexForward: false,
    };

    if (type !== undefined) {
      params.FilterExpression = ' #type = :type';
      params.ExpressionAttributeValues![':type'] = type;
    }

    if (date !== undefined) {
      params.FilterExpression = '#yearMonth = :yearMonth';
      params.ExpressionAttributeValues![':yearMonth'] = date;
    }

    if (categoryId !== undefined) {
      params.FilterExpression = '#categoryId = :categoryId';
      params.ExpressionAttributeValues![':categoryId'] = categoryId;
    }

    if (isPaid !== undefined) {
      params.FilterExpression = 'isPaid = :isPaid';
      params.ExpressionAttributeValues![':isPaid'] = isPaid;
    }
    const { Items } = await this.database.query(params).promise();

    return Items as TransactionsTypes[];
  }
  async find(id: string): Promise<TransactionsTypes> {
    const params = {
      TableName: this.TableName,
      Key: { id },
    };
    const { Item } = await this.database.get(params).promise();

    return Item as TransactionsTypes;
  }

  async createInstallmentTransaction(data: CreateTransactionsDto) {
    if (!data.finalInstallment || !data.installment) return;
    const finalInstallment = data.finalInstallment - data.installment;

    for (let i = 1; i <= finalInstallment; i++) {
      const newTransaction: CreateTransactionsDto = {
        ...data,
        id: uuid(),
        installment: data.installment + i,
        finalInstallment: data.finalInstallment,
        isPaid: false,
        date: addMonths(parseISO(data.date), i).toString(),
      };

      await this.database
        .put({
          TableName: this.TableName,
          Item: newTransaction,
        })
        .promise();
    }
  }

  async create(
    transaction: CreateTransactionsDto
  ): Promise<CreateTransactionsDto> {
    transaction.id = uuid();

    if (transaction.finalInstallment && transaction.type === '-') {
      await this.createInstallmentTransaction(transaction);
    }

    await this.database
      .put({
        TableName: this.TableName,
        Item: transaction,
      })
      .promise();
    return transaction;
  }

  async findLast(userId: string): Promise<TransactionsTypes[]> {
    const params: DynamoDB.DocumentClient.QueryInput = {
      TableName: this.TableName,
      IndexName: 'UserFindIndex',
      KeyConditionExpression: 'userId = :userId',
      ExpressionAttributeValues: {
        ':userId': userId,
        ':isPaidValue': true,
      },
      FilterExpression: '#isPaid = :isPaidValue',
      ExpressionAttributeNames: {
        // '#categoryName': 'category.name',
        '#isPaid': 'isPaid',
      },
      // ProjectionExpression: 'id, #categoryName',
      Limit: 10,
      ScanIndexForward: false,
    };

    const { Items } = await this.database.query(params).promise();

    return Items as TransactionsTypes[];
  }

  async update(id: string, transaction: UpdateTransactionsDto): Promise<void> {
    const params: DynamoDB.DocumentClient.UpdateItemInput = {
      TableName: this.TableName, // Substitua pelo nome correto da tabela
      Key: { id },
      UpdateExpression:
        'SET description = :description, value = :value, categoryId = :categoryId',
      ExpressionAttributeValues: {
        ':description': transaction.description,
        ':value': transaction.value,
        ':categoryId': transaction.categoryId,
      },
    };
    await this.database.update(params).promise();
  }
}
