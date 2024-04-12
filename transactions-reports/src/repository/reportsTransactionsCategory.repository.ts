import { DynamoDB } from '@aws-sdk/client-dynamodb'
import { PutCommand, ScanCommand, DynamoDBDocumentClient, QueryCommand, UpdateCommand } from '@aws-sdk/lib-dynamodb'

import {
  FindReportCategoryTypes,
  ReportTransactionsCategoryType,
  UpdateDecreaseValueReportsCategoryType,
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
      KeyConditionExpression: 'userId = :userId AND #ym = :yearMonth',
      IndexName: 'UserCategoryIndex',
      ExpressionAttributeNames: {
        '#ym': 'yearMonth',
      },
      ExpressionAttributeValues: {
        ':yearMonth': yearMonth,
        ':userId': userId,
      },
    })

    const { Items } = await this.dynamodbDocumentClient.send(params)
    if (!Items) {
      return null
    }
    const filteredItems = Items.filter((item) => {
      return item.category === categoryName
    })
    return filteredItems[0] as ReportTransactionsCategoryType
  }
  async updateReportValue(id: string, currentReport: UpdateReportTransactionsCategoryType): Promise<void> {
    const params = new UpdateCommand({
      TableName: process.env.TABLE_NAME,
      Key: { id },
      UpdateExpression: 'SET #currValue = :currentValue, #qtdTransactions = :qtdTransactions, dtUpdated = :dtUpdated',
      ExpressionAttributeNames: {
        '#currValue': 'value',
        '#qtdTransactions': 'quantityTransactions',
      },
      ExpressionAttributeValues: {
        ':currentValue': currentReport.value,
        ':qtdTransactions': currentReport.quantityTransactions,
        ':dtUpdated': new Date().toISOString(),
      },
    })
    await this.dynamodbDocumentClient.send(params)
  }

  async updateDecreaseReportValue(id: string, currentReport: UpdateDecreaseValueReportsCategoryType): Promise<void> {
    const params = new UpdateCommand({
      TableName: process.env.TABLE_NAME,
      Key: { id: id },
      ExpressionAttributeNames: {
        '#currValue': 'value',
        '#qtdTransactions': 'quantityTransactions',
      },
      UpdateExpression: 'SET #currValue = :currValue, #qtdTransactions = :qtdTransactions, dtUpdated = :dtUpdated',
      ExpressionAttributeValues: {
        ':qtdTransactions': currentReport.quantityTransactions,
        ':currValue': currentReport.value,
        ':dtUpdated': new Date().toISOString(),
      },
    })
    await this.dynamodbDocumentClient.send(params)
  }
}
