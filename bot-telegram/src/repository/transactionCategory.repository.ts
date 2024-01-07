import { DynamoDB } from '@aws-sdk/client-dynamodb'
import { ScanCommand, DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb'

import { TransactionCategoryType } from '../shared/types'
import { TransactionCategoryRepositoryInterface } from './interface/transactionCategory.interface'

export class TransactionCategoryRepository implements TransactionCategoryRepositoryInterface {
  private dynamodbClient: DynamoDB
  private dynamodbDocumentClient: DynamoDBDocumentClient
  private tableName: string

  constructor() {
    this.dynamodbClient = new DynamoDB()
    this.dynamodbDocumentClient = DynamoDBDocumentClient.from(this.dynamodbClient)
    this.tableName = process.env.TABLE_TRANSACTIONS_CARD_NAME ?? ''
  }

  async findAll(): Promise<TransactionCategoryType[]> {
    const params = new ScanCommand({
      TableName: this.tableName,
    })
    const result = await this.dynamodbDocumentClient.send(params)

    if (!result.Items?.length) {
      return [] as TransactionCategoryType[]
    }
    return result.Items as TransactionCategoryType[]
  }
}
