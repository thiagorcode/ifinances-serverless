import { DynamoDB } from 'aws-sdk';
import { Database } from '../shared/database';
import UsersRepositoryInterface from './interface/users.repository.interface';
import { v4 as uuid } from 'uuid';
import { UsersTypes } from './types';

export class UsersRepository implements UsersRepositoryInterface {
  private readonly database: DynamoDB.DocumentClient;
  private readonly TableName: string;
  constructor() {
    this.database = new Database().dynamoDb;
    this.TableName = 'users';
  }

  async findByUserId(userId: string): Promise<UsersTypes | undefined> {
    const params = {
      TableName: this.TableName,
      Key: { id: userId },
    };
    const { Item } = await this.database.get(params).promise();

    return Item as UsersTypes;
  }

  async createUser(user: UsersTypes): Promise<UsersTypes> {
    user.id = uuid();
    await this.database
      .put({
        TableName: this.TableName,
        Item: user,
      })
      .promise();
    return user;
  }
}
