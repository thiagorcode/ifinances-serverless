import { DynamoDB } from '@aws-sdk/client-dynamodb'
import { QueryCommand, DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb'

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

  async findByUserId(userId: string): Promise<TransactionCardType[]> {
    const params = new QueryCommand({
      TableName: this.tableName,
      KeyConditionExpression: 'userId = :userId',
      ExpressionAttributeValues: {
        ':userId': userId,
      },
    })
    const result = await this.dynamodbDocumentClient.send(params)

    if (!result.Items?.length) {
      return [] as TransactionCardType[]
    }
    return result.Items as TransactionCardType[]
  }
}
