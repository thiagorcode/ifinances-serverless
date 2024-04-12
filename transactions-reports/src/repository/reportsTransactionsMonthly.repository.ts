import { DynamoDB } from '@aws-sdk/client-dynamodb'
import { PutCommand, ScanCommand, DynamoDBDocumentClient, QueryCommand, UpdateCommand } from '@aws-sdk/lib-dynamodb'

import {
  ReportTransactionsMonthlyType,
  FindReportMonthlyQueryType,
  ReportsMonthlyTypes,
  UpdateExpenseValueMonthlyType,
  UpdateRecipeValueMonthlyType,
  UpdateDecreaseValueReportsMonthlyType,
} from '../shared/types'
import { ReportsTransactionMonthlyInterface } from './interface/reportsTransactionMonthly.interface'

export class ReportsTransactionsMonthlyRepository implements ReportsTransactionMonthlyInterface {
  private dynamodbClient: DynamoDB
  private dynamodbDocumentClient: DynamoDBDocumentClient

  constructor() {
    this.dynamodbClient = new DynamoDB()
    this.dynamodbDocumentClient = DynamoDBDocumentClient.from(this.dynamodbClient)
  }

  async create(data: ReportTransactionsMonthlyType): Promise<void> {
    const params = new PutCommand({
      TableName: process.env.TABLE_NAME,
      Item: data,
    })

    await this.dynamodbDocumentClient.send(params)
  }

  async findAll(): Promise<ReportTransactionsMonthlyType[]> {
    const params = new ScanCommand({
      TableName: process.env.TABLE_NAME,
    })

    const result = await this.dynamodbDocumentClient.send(params)

    if (!result.Items) return []
    return result.Items as unknown as ReportTransactionsMonthlyType[]
  }

  async findByUserId(userId: string): Promise<ReportTransactionsMonthlyType[]> {
    const params = new QueryCommand({
      TableName: process.env.TABLE_NAME,
      KeyConditionExpression: 'userId = :userId',
      ExpressionAttributeValues: {
        ':userId': userId,
      },
    })
    const result = await this.dynamodbDocumentClient.send(params)

    if (!result.Items) return []
    return result.Items as ReportTransactionsMonthlyType[]
  }
  async find({ yearMonth, userId }: FindReportMonthlyQueryType): Promise<ReportsMonthlyTypes | null> {
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
      Key: { id: id, yearMonth: currentReport.yearMonth },

      UpdateExpression:
        'SET recipeValue = :recipeValue, #totalValue = :totalValue, #qtdTransactions = :qtdTransactions, dtUpdated = :dtUpdated',
      ExpressionAttributeNames: {
        '#totalValue': 'total',
        '#qtdTransactions': 'quantityTransactions',
      },
      ExpressionAttributeValues: {
        ':recipeValue': currentReport.recipeValue,
        ':totalValue': currentReport.total,
        ':qtdTransactions': currentReport.quantityTransactions,
        ':dtUpdated': new Date().toISOString(),
      },
    })
    await this.dynamodbDocumentClient.send(params)
  }

  async updateExpenseValue(id: string, currentReport: UpdateExpenseValueMonthlyType): Promise<void> {
    const params = new UpdateCommand({
      TableName: process.env.TABLE_NAME,
      Key: { id, yearMonth: currentReport.yearMonth },
      UpdateExpression:
        'SET expenseValue = :expenseValue, #totalValue = :totalValue, #qtdTransactions = :qtdTransactions, dtUpdated = :dtUpdated',
      ExpressionAttributeNames: {
        '#totalValue': 'total',
        '#qtdTransactions': 'quantityTransactions',
      },
      ExpressionAttributeValues: {
        ':expenseValue': currentReport.expenseValue,
        ':totalValue': currentReport.total,
        ':qtdTransactions': currentReport.quantityTransactions,
        ':dtUpdated': new Date().toISOString(),
      },
    })
    await this.dynamodbDocumentClient.send(params)
  }

  async updateDecreaseReportValue(id: string, currentReport: UpdateDecreaseValueReportsMonthlyType): Promise<void> {
    const params = new UpdateCommand({
      TableName: process.env.TABLE_NAME,
      Key: { id: id },
      UpdateExpression:
        'SET recipeValue = :recipeValue, expenseValue = :expenseValue ,total = :total, #qtdTransactions = :qtdTransactions, dtUpdated = :dtUpdated',
      ExpressionAttributeNames: {
        '#qtdTransactions': 'quantityTransactions',
      },
      ExpressionAttributeValues: {
        ':qtdTransactions': currentReport.quantityTransactions,
        ':recipeValue': currentReport.recipeValue,
        ':expenseValue': currentReport.expenseValue,
        ':total': currentReport.total,
        ':dtUpdated': new Date().toISOString(),
      },
    })
    await this.dynamodbDocumentClient.send(params)
  }
}
