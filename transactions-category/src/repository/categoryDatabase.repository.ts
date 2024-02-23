import { DynamoDB } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocumentClient, ScanCommand, PutCommand } from '@aws-sdk/lib-dynamodb'

import CategoryDatabaseRepositoryInterface from './interface/categoryDatabaseRepository.interface'
import { TransactionsCategoryTypes } from '../shared/types'

// TODO: Preciso pensar uma maneira para refatorar e separar cada metódo em um arquivo execute

export class CategoryDatabaseRepository implements CategoryDatabaseRepositoryInterface {
  private dynamodbClient: DynamoDB
  private dynamodbDocumentClient: DynamoDBDocumentClient

  constructor() {
    this.dynamodbClient = new DynamoDB()
    this.dynamodbDocumentClient = DynamoDBDocumentClient.from(this.dynamodbClient)
  }

  async create(category: TransactionsCategoryTypes) {
    const params = new PutCommand({
      TableName: process.env.TABLE_NAME,
      Item: category,
    })

    await this.dynamodbDocumentClient.send(params)
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
