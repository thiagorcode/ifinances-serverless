import { DynamoDB } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocumentClient, QueryCommand } from '@aws-sdk/lib-dynamodb'

import { ReportTransactionMonthlyType } from '../shared/types'
import { ReportTransactionMonthlyRepositoryInterface } from './interface/reportTransactionMonthly.interface'

export class ReportTransactionMonthlyRepository implements ReportTransactionMonthlyRepositoryInterface {
  private dynamodbClient: DynamoDB
  private dynamodbDocumentClient: DynamoDBDocumentClient
  private tableName: string

  constructor() {
    this.dynamodbClient = new DynamoDB()
    this.dynamodbDocumentClient = DynamoDBDocumentClient.from(this.dynamodbClient)
    this.tableName = process.env.TABLE_REPORT_TRANSACTIONS_MONTHLY ?? ''
  }

  async find(yearMonth: string, userId: string): Promise<ReportTransactionMonthlyType | null> {
    const params = new QueryCommand({
      TableName: this.tableName,
      KeyConditionExpression: 'userId = :userId AND yearMonth = :yearMonth',
      IndexName: 'UserYearMonthIndex',
      ExpressionAttributeValues: {
        ':yearMonth': yearMonth,
        ':userId': userId,
      },
    })
    const { Items } = await this.dynamodbDocumentClient.send(params)

    if (!Items) {
      return null
    }
    return Items[0] as ReportTransactionMonthlyType
  }
}
