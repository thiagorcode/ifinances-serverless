import { DynamoDB } from '@aws-sdk/client-dynamodb'
import { PutCommand, ScanCommand, DynamoDBDocumentClient, GetCommand, QueryCommand } from '@aws-sdk/lib-dynamodb'

import TransactionRepositoryInterface from './interface/transactionRepository.interface'
import { CreateTransactionsType, TransactionsTypes } from '../shared/types'

// TODO: Preciso pensar uma maneira para refatorar e separar cada metódo em um arquivo execute

export class TransactionRepository implements TransactionRepositoryInterface {
  private dynamodbClient: DynamoDB
  private dynamodbDocumentClient: DynamoDBDocumentClient

  constructor() {
    this.dynamodbClient = new DynamoDB()
    this.dynamodbDocumentClient = DynamoDBDocumentClient.from(this.dynamodbClient)
  }

  async create(data: CreateTransactionsType): Promise<void> {
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
      KeyConditionExpression: 'userId = :userId',
      ExpressionAttributeValues: {
        ':userId': userId,
      },
    })
    const result = await this.dynamodbDocumentClient.send(params)

    if (!result.Items) return []
    return result.Items as TransactionsTypes[]
  }
}
