import { DynamoDB } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocumentClient, PutCommand } from '@aws-sdk/lib-dynamodb'

import CategoryDatabaseRepositoryInterface from './interface/categoryDatabaseRepository.interface'
import { TransactionsCategoryTypes } from '../shared/schemas'

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
      TableName: process.env.TABLE_TRANSACTIONS_CATEGORY_NAME,
      Item: category,
    })

    await this.dynamodbDocumentClient.send(params)
  }
}
