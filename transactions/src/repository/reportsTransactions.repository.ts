import { DynamoDB } from '@aws-sdk/client-dynamodb'
import { PutCommand, ScanCommand, DynamoDBDocumentClient, QueryCommand } from '@aws-sdk/lib-dynamodb'

import {
  CreateReportMonthlyType,
  FindReportMonthlyTypes,
  ReportsMonthlyTypes,
  TransactionsTypes,
} from '../shared/types'
import ReportsTransactionInterface from './interface/reportsTransaction.interface'

export class ReportsTransactionsRepository implements ReportsTransactionInterface {
  private dynamodbClient: DynamoDB
  private dynamodbDocumentClient: DynamoDBDocumentClient

  constructor() {
    this.dynamodbClient = new DynamoDB()
    this.dynamodbDocumentClient = DynamoDBDocumentClient.from(this.dynamodbClient)
  }

  async create(data: CreateReportMonthlyType): Promise<void> {
    const params = new PutCommand({
      TableName: process.env.TABLE_REPORTS_TRANSACTION,
      Item: data,
    })

    await this.dynamodbDocumentClient.send(params)
  }

  async findAll(): Promise<TransactionsTypes[]> {
    const params = new ScanCommand({
      TableName: process.env.TABLE_REPORTS_TRANSACTION,
    })

    const result = await this.dynamodbDocumentClient.send(params)

    if (!result.Items) return []
    return result.Items as unknown as TransactionsTypes[]
  }

  async findByUserId(userId: string): Promise<TransactionsTypes[]> {
    const params = new QueryCommand({
      TableName: process.env.TABLE_REPORTS_TRANSACTION,
      KeyConditionExpression: 'userId = :userId',
      ExpressionAttributeValues: {
        ':userId': userId,
      },
    })
    const result = await this.dynamodbDocumentClient.send(params)

    if (!result.Items) return []
    return result.Items as TransactionsTypes[]
  }
  async find({ year, yearMonth, userId }: FindReportMonthlyTypes): Promise<ReportsMonthlyTypes | null> {
    const params = new QueryCommand({
      TableName: process.env.TABLE_REPORTS_TRANSACTION,
      KeyConditionExpression: 'year = :year AND yearMonth = :yearMonth AND userId = :userId',
      ExpressionAttributeValues: {
        ':year': year,
        ':yearMonth': yearMonth,
        ':userId': userId,
      },
    })

    console.log('params', params)

    const { Items } = await this.dynamodbDocumentClient.send(params)
    if (!Items) {
      return null
    }
    return Items[0] as ReportsMonthlyTypes
  }
}
