import { DynamoDB } from '@aws-sdk/client-dynamodb'
import { PutCommand, DynamoDBDocumentClient, UpdateCommand } from '@aws-sdk/lib-dynamodb'

import { EventTransactionsReportType, UpdateEventTransactionsReportType } from '../shared/types'
import { EventsTransactionsReportInterface } from './interface/eventsTransactionsReport.interface'

export class EventsTransactionsReportRepository implements EventsTransactionsReportInterface {
  private dynamodbClient: DynamoDB
  private dynamodbDocumentClient: DynamoDBDocumentClient

  constructor() {
    this.dynamodbClient = new DynamoDB()
    this.dynamodbDocumentClient = DynamoDBDocumentClient.from(this.dynamodbClient)
  }

  async create(data: EventTransactionsReportType): Promise<void> {
    const params = new PutCommand({
      TableName: process.env.EVENTS_REPORT_TABLE_NAME,
      Item: data,
    })

    await this.dynamodbDocumentClient.send(params)
  }

  async update(id: string, data: UpdateEventTransactionsReportType): Promise<void> {
    const params = new UpdateCommand({
      TableName: process.env.EVENTS_REPORT_TABLE_NAME,
      Key: { pk: id },
      UpdateExpression: 'SET eventType = :eventType',
      ExpressionAttributeValues: {
        ':eventType': data.eventType,
      },
    })
    await this.dynamodbDocumentClient.send(params)
  }
}
