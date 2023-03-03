import { DynamoDB } from 'aws-sdk';
import { Users } from 'src/shared/database/entities/users.entity';

export default interface UsersRepositoryProps {
  findByUserId(userId: string): Promise<DynamoDB.DocumentClient.AttributeMap | undefined>;
}
