import { DynamoDB } from 'aws-sdk';

export default interface UsersRepositoryInterface {
  findByUserId(
    userId: string
  ): Promise<DynamoDB.DocumentClient.AttributeMap | undefined>;
}
