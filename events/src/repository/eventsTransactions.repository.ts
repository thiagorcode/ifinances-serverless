import { DynamoDB } from '@aws-sdk/client-dynamodb'
import {
  PutCommand,
  ScanCommand,
  DynamoDBDocumentClient,
  UpdateCommand,
} from '@aws-sdk/lib-dynamodb'

import {
  CreateTransactionsType,
  UpdateTransactionsType,
} from '../shared/types'
import { EventsTransactionsRepositoryInterface } from './interface/eventsTransactionsRepository.interface '


export class EventsTransactionsRepository implements EventsTransactionsRepositoryInterface {
  private dynamodbClient: DynamoDB
  private dynamodbDocumentClient: DynamoDBDocumentClient

  constructor() {
    this.dynamodbClient = new DynamoDB()
    this.dynamodbDocumentClient = DynamoDBDocumentClient.from(this.dynamodbClient)
  }

  async create(data: CreateTransactionsType): Promise<void> {
    const params = new PutCommand({
      TableName: process.env.EVENTS_TRANSACTIONS_TABLE_NAME,
      Item: data,
    })

    await this.dynamodbDocumentClient.send(params)
  }
  

  async findAll(): Promise<TransactionsTypes[]> {
    const params = new ScanCommand({
      TableName: process.env.EVENTS_TRANSACTIONS_TABLE_NAME,
    })

    const result = await this.dynamodbDocumentClient.send(params)

    if (!result.Items) return []
    return result.Items as unknown as TransactionsTypes[]
  }

  
  async update(id: string, transaction: UpdateTransactionsType): Promise<void> {
    const params = new UpdateCommand({
      TableName: process.env.EVENTS_TRANSACTIONS_TABLE_NAME,
      Key: { id },
      UpdateExpression:
        'SET description = :description, value = :value, year = :year, yearMonth = :yearMonth, categoryId = :categoryId, dtUpdated = :dtUpdated',
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
