import { DynamoDB } from '@aws-sdk/client-dynamodb'
import { ScanCommand, DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb'

import { UsersBotTypes } from '../shared/types'
import { UserBotRepositoryInterface } from './interface/userBotRepository.interface'

export class UserBotRepository implements UserBotRepositoryInterface {
  private dynamodbClient: DynamoDB
  private dynamodbDocumentClient: DynamoDBDocumentClient
  private tableName: string

  constructor() {
    this.dynamodbClient = new DynamoDB()
    this.dynamodbDocumentClient = DynamoDBDocumentClient.from(this.dynamodbClient)
    this.tableName = process.env.TABLE_USER_BOT_PREFERENCES_NAME ?? ''
  }

  async findAllUsers(): Promise<UsersBotTypes[]> {
    const params = new ScanCommand({
      TableName: this.tableName,
    })
    const result = await this.dynamodbDocumentClient.send(params)

    if (!result.Items?.length) {
      return [] as UsersBotTypes[]
    }
    return result.Items as UsersBotTypes[]
  }
}
