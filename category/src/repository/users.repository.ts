import { DynamoDB } from 'aws-sdk';
import { Database } from '@shared/database';
import { Users } from '@shared/database/entities/users.entity';
import UsersRepositoryProps from './interface/users.repository.interface';

export class UsersRepository implements UsersRepositoryProps {
  private readonly database: DynamoDB.DocumentClient;
  private readonly TableName: string;
  constructor() {
    this.database = new Database().dynamoDb;
    this.TableName = 'Users';
  }

  async findByUserId(userId: string) {
    const params = {
      TableName: this.TableName,
      Key: { userId },
    };
    const { Item } = await this.database.get(params).promise();

    return Item;
  }
}
