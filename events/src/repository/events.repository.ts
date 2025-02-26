import { DynamoDB } from '@aws-sdk/client-dynamodb'
import { PutCommand, DynamoDBDocumentClient, UpdateCommand } from '@aws-sdk/lib-dynamodb'

import { EventTransactions, UpdateTransactionsType } from '../shared/types'
import { EventsRepositoryInterface } from './interface/eventsRepository.interface'

export class EventsRepository implements EventsRepositoryInterface {
  private dynamodbClient: DynamoDB
  private dynamodbDocumentClient: DynamoDBDocumentClient
  private tableName: string

  constructor(tableName: string) {
    this.dynamodbClient = new DynamoDB()
    this.dynamodbDocumentClient = DynamoDBDocumentClient.from(this.dynamodbClient)
    this.tableName = tableName
  }

  async create(data: EventTransactions): Promise<void> {
    const params = new PutCommand({
      TableName: this.tableName,
      Item: data,
    })

    await this.dynamodbDocumentClient.send(params)
  }

  async update(id: string, transaction: UpdateTransactionsType): Promise<void> {
    const params = new UpdateCommand({
      TableName: this.tableName,
      Key: { id },
      UpdateExpression: 'SET description = :description, value = :value, dtUpdated = :dtUpdated',
      ExpressionAttributeValues: {
        ':description': transaction.description,
        ':value': transaction.value,
        ':category': transaction.category,
        ':yearMonth': transaction.yearMonth,
        ':year': transaction.year,
        ':dtUpdated': new Date().toISOString(),
      },
    })
    await this.dynamodbDocumentClient.send(params)
  }
}
