import { DynamoDB } from 'aws-sdk';
import { Database } from '@shared/database';
// import { Users } from '@shared/database/entities/users.entity';
import UsersRepositoryInterface from './interface/users.repository.interface';

export class UsersRepository implements UsersRepositoryInterface {
  // private readonly database: DynamoDB.DocumentClient;
  // private readonly TableName: string;
  // constructor() {
  //   this.database = new Database().dynamoDb;
  //   this.TableName = 'Users';
  // }

  async findByUserId(userId: string) {
    // const params = {
    //   TableName: this.TableName,
    //   Key: { userId },
    // };
    // const { Item } = await this.database.get(params).promise();

    return [{ userId }];
  }
}
