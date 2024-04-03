import { DynamoDB } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocumentClient, QueryCommand } from '@aws-sdk/lib-dynamodb'
import { ReportTransactionCategoryType } from '../shared/types'
import { ReportTransactionCategoryRepositoryInterface } from './interface/reportTransactionCategory.interface'
import { isNullOrUndefined } from '../utils'

export class ReportTransactionCategoryRepository implements ReportTransactionCategoryRepositoryInterface {
  private dynamodbClient: DynamoDB
  private dynamodbDocumentClient: DynamoDBDocumentClient
  private tableName: string

  constructor() {
    this.dynamodbClient = new DynamoDB()
    this.dynamodbDocumentClient = DynamoDBDocumentClient.from(this.dynamodbClient)
    this.tableName = process.env.TABLE_REPORT_TRANSACTIONS_CATEGORY_NAME ?? ''
  }

  async find(yearMonth: string, userId: string): Promise<ReportTransactionCategoryType[]> {
    const params = new QueryCommand({
      TableName: this.tableName,
      KeyConditionExpression: 'userId = :userId AND yearMonth = :yearMonth',
      IndexName: 'UserCategoryIndex',
      ExpressionAttributeValues: {
        ':yearMonth': yearMonth,
        ':userId': userId,
      },
    })
    const { Items } = await this.dynamodbDocumentClient.send(params)

    if (isNullOrUndefined(Items)) {
      return []
    }
    return Items as ReportTransactionCategoryType[]
  }
}
