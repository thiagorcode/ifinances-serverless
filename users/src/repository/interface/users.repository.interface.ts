import { DynamoDB } from 'aws-sdk';
import { UsersTypes } from '../types';

export default interface UsersRepositoryInterface {
  findByUserId(
    userId: string
  ): Promise<DynamoDB.DocumentClient.AttributeMap | undefined>;
  createUser(user: UsersTypes): Promise<UsersTypes>;
}
