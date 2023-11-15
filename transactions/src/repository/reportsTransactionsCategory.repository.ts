import { DynamoDB } from '@aws-sdk/client-dynamodb'
import { PutCommand, ScanCommand, DynamoDBDocumentClient, QueryCommand, UpdateCommand } from '@aws-sdk/lib-dynamodb'

import {
  FindReportCategoryTypes,
  ReportTransactionsCategoryType,
  UpdateReportTransactionsCategoryType,
} from '../shared/types'
import ReportsTransactionCategoryInterface from './interface/reportsTransactionCategory.interface'

export class ReportsTransactionsCategoryRepository implements ReportsTransactionCategoryInterface {
  private dynamodbClient: DynamoDB
  private dynamodbDocumentClient: DynamoDBDocumentClient

  constructor() {
    this.dynamodbClient = new DynamoDB()
    this.dynamodbDocumentClient = DynamoDBDocumentClient.from(this.dynamodbClient)
  }

  async create(data: ReportTransactionsCategoryType): Promise<void> {
    const params = new PutCommand({
      TableName: process.env.TABLE_NAME,
      Item: data,
    })

    await this.dynamodbDocumentClient.send(params)
  }

  async findAll(): Promise<ReportTransactionsCategoryType[]> {
    const params = new ScanCommand({
      TableName: process.env.TABLE_NAME,
    })

    const result = await this.dynamodbDocumentClient.send(params)

    if (!result.Items) return []
    return result.Items as unknown as ReportTransactionsCategoryType[]
  }

  async findByUserId(userId: string): Promise<ReportTransactionsCategoryType[]> {
    const params = new QueryCommand({
      TableName: process.env.TABLE_NAME,
      KeyConditionExpression: 'userId = :userId',
      ExpressionAttributeValues: {
        ':userId': userId,
      },
    })
    const result = await this.dynamodbDocumentClient.send(params)

    if (!result.Items) return []
    return result.Items as ReportTransactionsCategoryType[]
  }
  async find({
    yearMonth,
    userId,
    categoryName,
  }: FindReportCategoryTypes): Promise<ReportTransactionsCategoryType | null> {
    const params = new QueryCommand({
      TableName: process.env.TABLE_NAME,
      KeyConditionExpression: 'userId = :userId AND yearMonth = :yearMonth AND category = :category',
      IndexName: 'UserCategoryIndex',
      ExpressionAttributeValues: {
        ':yearMonth': yearMonth,
        ':userId': userId,
        ':category': categoryName,
      },
    })

    const { Items } = await this.dynamodbDocumentClient.send(params)
    if (!Items) {
      return null
    }
    return Items[0] as ReportTransactionsCategoryType
  }
  async updateReportValue(id: string, currentReport: UpdateReportTransactionsCategoryType): Promise<void> {
    const params = new UpdateCommand({
      TableName: process.env.TABLE_NAME,
      Key: { id: { S: id } },
      UpdateExpression: 'SET value = :value, dtUpdated = :dtUpdated, quantityTransactions = :qtdTransactions',
      ExpressionAttributeValues: {
        ':value': currentReport.value,
        ':qtdTransactions': currentReport.quantityTransactions,
        ':dtUpdated': new Date().toISOString(),
      },
    })
    await this.dynamodbDocumentClient.send(params)
  }
}