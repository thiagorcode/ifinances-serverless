import { DynamoDB } from '@aws-sdk/client-dynamodb'
import { PutCommand, ScanCommand, DynamoDBDocumentClient, QueryCommand, UpdateCommand } from '@aws-sdk/lib-dynamodb'

import {
  CreateReportMonthlyType,
  FindReportMonthlyTypes,
  ReportsMonthlyTypes,
  TransactionsTypes,
  UpdateExpenseValueMonthlyType,
  UpdateRecipeValueMonthlyType,
} from '../shared/types'
import ReportsTransactionMonthlyInterface from './interface/reportsTransactionMonthly.interface'

export class ReportsTransactionsMonthlyRepository implements ReportsTransactionMonthlyInterface {
  private dynamodbClient: DynamoDB
  private dynamodbDocumentClient: DynamoDBDocumentClient

  constructor() {
    this.dynamodbClient = new DynamoDB()
    this.dynamodbDocumentClient = DynamoDBDocumentClient.from(this.dynamodbClient)
  }

  async create(data: CreateReportMonthlyType): Promise<void> {
    const params = new PutCommand({
      TableName: process.env.TABLE_NAME,
      Item: data,
    })

    await this.dynamodbDocumentClient.send(params)
  }

  async findAll(): Promise<TransactionsTypes[]> {
    const params = new ScanCommand({
      TableName: process.env.TABLE_NAME,
    })

    const result = await this.dynamodbDocumentClient.send(params)

    if (!result.Items) return []
    return result.Items as unknown as TransactionsTypes[]
  }

  async findByUserId(userId: string): Promise<TransactionsTypes[]> {
    const params = new QueryCommand({
      TableName: process.env.TABLE_NAME,
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
      TableName: process.env.TABLE_NAME,
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
    return Items[0] as ReportsMonthlyTypes
  }
  async updateRecipeValue(id: string, currentReport: UpdateRecipeValueMonthlyType): Promise<void> {
    const params = new UpdateCommand({
      TableName: process.env.TABLE_NAME,
      Key: { id: { S: id } },
      UpdateExpression: 'SET recipeValue = :recipeValue, #totalValue = :total, dtUpdated = :dtUpdated',
      ExpressionAttributeNames: {
        '#totalValue': 'total',
      },
      ExpressionAttributeValues: {
        ':recipeValue': currentReport.recipeValue,
        ':total': currentReport.total,
        ':dtUpdated': new Date().toISOString(),
      },
    })
    await this.dynamodbDocumentClient.send(params)
  }

  async updateExpenseValue(id: string, currentReport: UpdateExpenseValueMonthlyType): Promise<void> {
    const params = new UpdateCommand({
      TableName: process.env.TABLE_NAME,
      Key: { id: { S: id } },
      UpdateExpression: 'SET expenseValue = :expenseValue, #totalValue = :total, dtUpdated = :dtUpdated',
      ExpressionAttributeNames: {
        '#totalValue': 'total',
      },
      ExpressionAttributeValues: {
        ':expenseValue': currentReport.expenseValue,
        ':total': currentReport.total,
        ':dtUpdated': new Date().toISOString(),
      },
    })
    await this.dynamodbDocumentClient.send(params)
  }
}
