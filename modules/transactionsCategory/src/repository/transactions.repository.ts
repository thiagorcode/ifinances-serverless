import { DynamoDB } from 'aws-sdk';
import { addMonths, parseISO } from 'date-fns';
import { v4 as uuid } from 'uuid';
import { Database } from '../shared/database';
import { TransactionsRepositoryInterface } from './interface/transactions.repository.interface';
import { TransactionsTypes } from './types';

export class TransactionsRepository implements TransactionsRepositoryInterface {
  private readonly database: DynamoDB.DocumentClient;
  private readonly TableName: string;
  constructor() {
    this.database = new Database().dynamoDb;
    this.TableName = 'finances-transactions';
  }

  async findByUserId(userId: string): Promise<TransactionsTypes | undefined> {
    const params = {
      TableName: this.TableName,
      Key: { userId },
    };
    const { Item } = await this.database.get(params).promise();

    return Item as TransactionsTypes;
  }

  async find(id: string): Promise<TransactionsTypes | undefined> {
    const params = {
      TableName: this.TableName,
      Key: { id },
    };
    const { Item } = await this.database.get(params).promise();

    return Item as TransactionsTypes;
  }

  async createInstallmentTransaction(data: TransactionsTypes) {
    if (!data.finalInstallment || !data.installment) return;
    const finalInstallment = data.finalInstallment - data.installment;

    for (let i = 1; i <= finalInstallment; i++) {
      const newTransaction: Omit<TransactionsTypes, 'id'> = {
        ...data,
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

  async create(transaction: TransactionsTypes): Promise<TransactionsTypes> {
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
}
