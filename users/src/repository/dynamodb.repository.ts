import { DynamoDB, ScanCommand } from '@aws-sdk/client-dynamodb'
import { PutCommand, DynamoDBDocumentClient, GetCommand } from '@aws-sdk/lib-dynamodb'

import DynamoDBRepositoryInterface from './interface/dynamodbRepository.interface'
import { UsersTypes } from '../shared/types'

// TODO: Preciso pensar uma maneira para refatorar e separar cada metódo em um arquivo execute

export class DynamoDBRepository implements DynamoDBRepositoryInterface {
  private dynamodbClient: DynamoDB
  private dynamodbDocumentClient: DynamoDBDocumentClient

  constructor() {
    this.dynamodbClient = new DynamoDB()
    this.dynamodbDocumentClient = DynamoDBDocumentClient.from(this.dynamodbClient)
    //  {
    //   endpoint: 'http://localhost:4569',
    //   region: 'sa-east-1',
    //   accessKeyId: 'local',
    //   secretAccessKey: 'local',
    // }
  }

  async createUser(data: UsersTypes): Promise<void> {
    const params = new PutCommand({
      TableName: 'YourTableName',
      Item: data,
    })

    await this.dynamodbDocumentClient.send(params)
  }

  async findById(id: string): Promise<UsersTypes> {
    const params = new GetCommand({
      TableName: 'YourTableName',
      Key: { id },
    })

    const result = await this.dynamodbDocumentClient.send(params)
    return result.Item as UsersTypes
  }

  async findAll(): Promise<UsersTypes[]> {
    const params = new ScanCommand({
      TableName: 'YourTableName',
    })

    const result = await this.dynamodbDocumentClient.send(params)

    if (!result.Items) return []
    return result.Items as unknown as UsersTypes[]
  }
}
