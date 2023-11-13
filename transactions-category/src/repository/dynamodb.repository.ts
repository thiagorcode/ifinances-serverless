import { DynamoDB, ScanCommand } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb'

import DynamoDBRepositoryInterface from './interface/dynamodbRepository.interface'
import { TransactionsCategoryTypes } from '../shared/types'

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

  async findAll(): Promise<TransactionsCategoryTypes[]> {
    const params = new ScanCommand({
      TableName: process.env.TABLE_NAME,
    })

    const result = await this.dynamodbDocumentClient.send(params)

    if (!result.Items) return []
    return result.Items as unknown as TransactionsCategoryTypes[]
  }
}
