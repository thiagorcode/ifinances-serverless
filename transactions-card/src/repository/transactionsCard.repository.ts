import { DynamoDB } from '@aws-sdk/client-dynamodb'
import {
  PutCommand,
  ScanCommand,
  DynamoDBDocumentClient,
  GetCommand,
  QueryCommand,
  UpdateCommand,
  DeleteCommand,
} from '@aws-sdk/lib-dynamodb'

import { TransactionCardRepositoryInterface } from './interface/transactionCardRepository.interface'
import { CreateCardTransactionsType, TransactionsTypes, UpdateTransactionsCardType } from '../shared/types'

export class TransactionCardRepository implements TransactionCardRepositoryInterface {
  private dynamodbClient: DynamoDB
  private dynamodbDocumentClient: DynamoDBDocumentClient

  constructor() {
    this.dynamodbClient = new DynamoDB()
    this.dynamodbDocumentClient = DynamoDBDocumentClient.from(this.dynamodbClient)
  }

  async create(data: CreateCardTransactionsType): Promise<void> {
    const params = new PutCommand({
      TableName: process.env.TABLE_NAME,
      Item: data,
    })

    await this.dynamodbDocumentClient.send(params)
  }

  async find(id: string): Promise<TransactionsTypes> {
    const params = new GetCommand({
      TableName: process.env.TABLE_NAME,
      Key: { id },
    })

    const result = await this.dynamodbDocumentClient.send(params)
    return result.Item as TransactionsTypes
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
      IndexName: 'CardByUserId',
      KeyConditionExpression: 'userId = :userId',
      ExpressionAttributeValues: {
        ':userId': userId,
      },
    })
    const result = await this.dynamodbDocumentClient.send(params)

    if (!result.Items) return []
    return result.Items as TransactionsTypes[]
  }

  async update(id: string, card: UpdateTransactionsCardType): Promise<void> {
    const params = new UpdateCommand({
      TableName: process.env.TABLE_NAME,
      Key: { id },
      UpdateExpression:
        'SET name = :name, limitValue = :limitValue, invoiceDueDate = :invoiceDueDate, dtUpdated = :dtUpdated',
      ExpressionAttributeValues: {
        ':name': card.name,
        ':limitValue': card.limitValue,
        ':invoiceDueDate': card.invoiceDueDate,
        ':dtUpdated': new Date().toISOString(),
      },
    })
    await this.dynamodbDocumentClient.send(params)
  }

  async delete(id: string): Promise<void> {
    // TODO:
    // const params = new UpdateCommand({
    //   TableName: process.env.TABLE_NAME,
    //   Key: { id },
    //   UpdateExpression: 'SET isDeleted = :isDeleted, dtUpdated = :dtUpdated',
    //   ExpressionAttributeValues: {
    //     ':isDeleted': true,
    //     ':dtUpdated': new Date().toISOString(),
    //   },
    // })
    const params = new DeleteCommand({
      TableName: process.env.TABLE_NAME,
      Key: { id },
    })
    await this.dynamodbDocumentClient.send(params)
  }
}
