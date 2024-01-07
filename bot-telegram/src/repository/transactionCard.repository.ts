import { DynamoDB } from '@aws-sdk/client-dynamodb'
import { ScanCommand, DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb'

import { TransactionCardType } from '../shared/types'
import { TransactionCardRepositoryInterface } from './interface/transactionCard.interface'

export class TransactionCardRepository implements TransactionCardRepositoryInterface {
  private dynamodbClient: DynamoDB
  private dynamodbDocumentClient: DynamoDBDocumentClient
  private tableName: string

  constructor() {
    this.dynamodbClient = new DynamoDB()
    this.dynamodbDocumentClient = DynamoDBDocumentClient.from(this.dynamodbClient)
    this.tableName = process.env.TABLE_TRANSACTIONS_CARD_NAME ?? ''
  }

  async findAll(): Promise<TransactionCardType[]> {
    const params = new ScanCommand({
      TableName: this.tableName,
    })
    const result = await this.dynamodbDocumentClient.send(params)

    if (!result.Items?.length) {
      return [] as TransactionCardType[]
    }
    return result.Items as TransactionCardType[]
  }
}
