import { DynamoDB, ScanCommand } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb'

import DynamoDBRepositoryInterface from './interface/dynamodbRepository.interface'

// TODO: Preciso pensar uma maneira para refatorar e separar cada metódo em um arquivo execute

export class DynamoDBRepository implements DynamoDBRepositoryInterface {
  private dynamodbClient: DynamoDB
  private dynamodbDocumentClient: DynamoDBDocumentClient

  constructor() {
    this.dynamodbClient = new DynamoDB()
    this.dynamodbDocumentClient = DynamoDBDocumentClient.from(this.dynamodbClient)
  }

  async find(): Promise<void> {
    const params = new ScanCommand({
      TableName: process.env.TABLE_NAME,
    })

    const result = await this.dynamodbDocumentClient.send(params)
  }
}
