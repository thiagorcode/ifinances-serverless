import { DynamoDB } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocumentClient, QueryCommand } from '@aws-sdk/lib-dynamodb'

import { ReportTransactionCardType } from '../shared/types'
import { ReportTransactionCardRepositoryInterface } from './interface/reportTransactionCard.interface'

export class ReportTransactionCardRepository implements ReportTransactionCardRepositoryInterface {
  private dynamodbClient: DynamoDB
  private dynamodbDocumentClient: DynamoDBDocumentClient
  private tableName: string

  constructor() {
    this.dynamodbClient = new DynamoDB()
    this.dynamodbDocumentClient = DynamoDBDocumentClient.from(this.dynamodbClient)
    this.tableName = process.env.TABLE_REPORT_TRANSACTIONS_CARD_NAME ?? ''
  }

  async find(yearMonth: string, userId: string): Promise<ReportTransactionCardType[] | null> {
    const params = new QueryCommand({
      TableName: this.tableName,
      KeyConditionExpression: 'userId = :userId AND yearMonth = :yearMonth',
      IndexName: 'UserCardIndex',
      ExpressionAttributeValues: {
        ':yearMonth': yearMonth,
        ':userId': userId,
      },
    })
    const { Items } = await this.dynamodbDocumentClient.send(params)

    if (!Items) {
      return null
    }
    return Items as ReportTransactionCardType[]
  }
}
