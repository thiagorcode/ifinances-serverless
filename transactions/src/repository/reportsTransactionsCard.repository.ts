import { DynamoDB } from '@aws-sdk/client-dynamodb'
import { PutCommand, ScanCommand, DynamoDBDocumentClient, QueryCommand, UpdateCommand } from '@aws-sdk/lib-dynamodb'

import {
  ReportTransactionsCardType,
  FindReportCardTypes,
  UpdateReportTransactionsCardType,
  UpdateDecreaseValueReportsCardType,
} from '../shared/types'
import ReportsTransactionCardInterface from './interface/reportsTransactionCard.interface'

export class ReportsTransactionsCardRepository implements ReportsTransactionCardInterface {
  private dynamodbClient: DynamoDB
  private dynamodbDocumentClient: DynamoDBDocumentClient

  constructor() {
    this.dynamodbClient = new DynamoDB()
    this.dynamodbDocumentClient = DynamoDBDocumentClient.from(this.dynamodbClient)
  }

  async create(data: ReportTransactionsCardType): Promise<void> {
    const params = new PutCommand({
      TableName: process.env.TABLE_NAME,
      Item: data,
    })

    await this.dynamodbDocumentClient.send(params)
  }

  async findAll(): Promise<ReportTransactionsCardType[]> {
    const params = new ScanCommand({
      TableName: process.env.TABLE_NAME,
    })

    const result = await this.dynamodbDocumentClient.send(params)

    if (!result.Items) return []
    return result.Items as unknown as ReportTransactionsCardType[]
  }

  async findByUserId(userId: string): Promise<ReportTransactionsCardType[]> {
    const params = new QueryCommand({
      TableName: process.env.TABLE_NAME,
      KeyConditionExpression: 'userId = :userId',
      ExpressionAttributeValues: {
        ':userId': userId,
      },
    })
    const result = await this.dynamodbDocumentClient.send(params)

    if (!result.Items) return []
    return result.Items as ReportTransactionsCardType[]
  }
  async find({ yearMonth, userId, card }: FindReportCardTypes): Promise<ReportTransactionsCardType | null> {
    const params = new QueryCommand({
      TableName: process.env.TABLE_NAME,
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
    const filteredItems = Items.filter((item) => {
      return item.card === card
    })
    return filteredItems[0] as ReportTransactionsCardType
  }
  async updateReportValue(id: string, currentReport: UpdateReportTransactionsCardType): Promise<void> {
    const params = new UpdateCommand({
      TableName: process.env.TABLE_NAME,
      Key: { id },
      UpdateExpression:
        'SET #curr_value = :currentValue, quantityTransactions = :qtdTransactions, dtUpdated = :dtUpdated',
      ExpressionAttributeNames: {
        '#curr_value': 'value',
      },
      ExpressionAttributeValues: {
        ':currentValue': currentReport.value,
        ':qtdTransactions': currentReport.quantityTransactions,
        ':dtUpdated': new Date().toISOString(),
      },
    })
    await this.dynamodbDocumentClient.send(params)
  }

  async updateDecreaseReportValue(id: string, currentReport: UpdateDecreaseValueReportsCardType): Promise<void> {
    const params = new UpdateCommand({
      TableName: process.env.TABLE_NAME,
      Key: { id: id },
      UpdateExpression: 'SET value = :value quantityTransactions = :quantityTransactions dtUpdated = :dtUpdated',
      ExpressionAttributeValues: {
        ':quantityTransactions': currentReport.quantityTransactions,
        ':value': currentReport.value,
        ':dtUpdated': new Date().toISOString(),
      },
    })
    await this.dynamodbDocumentClient.send(params)
  }
}
