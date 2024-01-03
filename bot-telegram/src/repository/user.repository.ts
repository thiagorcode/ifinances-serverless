import { DynamoDB } from '@aws-sdk/client-dynamodb'
import { ScanCommand, DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb'

import { UsersTypes } from '../shared/types'
import { UserRepositoryInterface } from './interface/userRepository.interface'

// TODO: Preciso pensar uma maneira para refatorar e separar cada metódo em um arquivo execute

export class UserRepository implements UserRepositoryInterface {
  private dynamodbClient: DynamoDB
  private dynamodbDocumentClient: DynamoDBDocumentClient

  constructor() {
    this.dynamodbClient = new DynamoDB()
    this.dynamodbDocumentClient = DynamoDBDocumentClient.from(this.dynamodbClient)
  }

  async findUserByBotUsername(userTelegram: string): Promise<UsersTypes | null> {
    const params = new ScanCommand({
      TableName: process.env.TABLE_USER_NAME,
      FilterExpression: 'contains(botPreferences, :botUsername)',
      ExpressionAttributeValues: {
        ':botUsername': { username: { S: userTelegram } },
      },
    })
    const result = await this.dynamodbDocumentClient.send(params)

    if (!result.Items?.length) {
      return null
    }
    return result.Items[0] as UsersTypes
  }
}
