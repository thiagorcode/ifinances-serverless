import { DynamoDB, ScanCommand } from '@aws-sdk/client-dynamodb'
import { PutCommand, DynamoDBDocumentClient, GetCommand } from '@aws-sdk/lib-dynamodb'

import DynamoDBRepositoryInterface from './interface/dynamodbRepository.interface'
import { UsersTypes } from '../shared/types'
import { parseEventDynamoDB } from '../utils/parseEventDynamoDB'

// TODO: Preciso pensar uma maneira para refatorar e separar cada metódo em um arquivo execute

export class DynamoDBRepository implements DynamoDBRepositoryInterface {
  private dynamodbClient: DynamoDB
  private dynamodbDocumentClient: DynamoDBDocumentClient

  constructor() {
    this.dynamodbClient = new DynamoDB()
    this.dynamodbDocumentClient = DynamoDBDocumentClient.from(this.dynamodbClient)
  }

  async createUser(data: UsersTypes): Promise<void> {
    const params = new PutCommand({
      TableName: process.env.TABLE_NAME,
      Item: data,
    })

    await this.dynamodbDocumentClient.send(params)
  }

  async findById(id: string): Promise<UsersTypes | undefined> {
    const params = new GetCommand({
      TableName: process.env.TABLE_NAME,
      Key: { id },
    })

    const result = await this.dynamodbDocumentClient.send(params)
    return result.Item as UsersTypes | undefined
  }

  async findByUsername(username: string): Promise<UsersTypes | null> {
    const params = new ScanCommand({
      TableName: process.env.TABLE_NAME,
      FilterExpression: 'username = :username',
      ExpressionAttributeValues: {
        ':username': { S: username },
      },
    })
    const result = await this.dynamodbDocumentClient.send(params)
    console.log(result)
    if (!result.Items) {
      return null
    }
    return parseEventDynamoDB<UsersTypes>(result.Items[0])
  }

  async findAll(): Promise<UsersTypes[]> {
    const params = new ScanCommand({
      TableName: process.env.TABLE_NAME,
    })

    const result = await this.dynamodbDocumentClient.send(params)

    if (!result.Items) return []
    return result.Items as unknown as UsersTypes[]
  }
}
