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

import TransactionRepositoryInterface from './interface/transactionRepository.interface'
import {
  CreateTransactionsType,
  FindAllWithQueryType,
  TransactionsTypes,
  UpdateTransactionsType,
} from '../shared/types'

// TODO: Preciso pensar uma maneira para refatorar e separar cada metódo em um arquivo execute

export class TransactionRepository implements TransactionRepositoryInterface {
  private dynamodbClient: DynamoDB
  private dynamodbDocumentClient: DynamoDBDocumentClient

  constructor() {
    this.dynamodbClient = new DynamoDB()
    this.dynamodbDocumentClient = DynamoDBDocumentClient.from(this.dynamodbClient)
    //  {
    //   endpoint: 'http://localhost:4569',
    //   region: 'sa-east-1',
    //   accessKeyId: 'local',
    //   secretAccessKey: 'local',
    // }
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
  async findAllWithQuery({
    categoryId,
    date,
    isPaid,
    type,
    userId,
  }: FindAllWithQueryType): Promise<TransactionsTypes[]> {
    const params = new QueryCommand({
      TableName: process.env.TABLE_NAME, // Substitua pelo nome correto da tabela
      IndexName: 'UserFindIndex',
      KeyConditionExpression: 'userId = :userId',
      ExpressionAttributeValues: {
        ':userId': userId,
      },
      ProjectionExpression:
        // 'id, #type, #date, userId, #value, isPaid, card, #description, #categoryName, #categoryId',
        'id, #type, #date, userId, #value, isPaid, card, #description',
      ExpressionAttributeNames: {
        '#type': 'type',
        '#date': 'date',
        '#value': 'value',
        '#description': 'description',
        // '#categoryName': 'category.name',
        // '#categoryId': 'category.id',
      },
      ScanIndexForward: false,
    })

    if (type !== undefined) {
      params.input.FilterExpression = ' #type = :type'
      params.input.ExpressionAttributeValues![':type'] = type
    }

    if (date !== undefined) {
      params.input.FilterExpression = '#yearMonth = :yearMonth'
      params.input.ExpressionAttributeValues![':yearMonth'] = date
    }

    if (categoryId !== undefined) {
      params.input.FilterExpression = '#categoryId = :categoryId'
      params.input.ExpressionAttributeValues![':categoryId'] = categoryId
    }

    if (isPaid !== undefined) {
      params.input.FilterExpression = 'isPaid = :isPaid'
      params.input.ExpressionAttributeValues![':isPaid'] = isPaid
    }
    const { Items } = await this.dynamodbDocumentClient.send(params)

    return Items as TransactionsTypes[]
  }
  async findLast(userId: string): Promise<TransactionsTypes[]> {
    const params = new QueryCommand({
      TableName: process.env.TABLE_NAME,
      IndexName: 'UserFindIndex',
      KeyConditionExpression: 'userId = :userId',
      ExpressionAttributeValues: {
        ':userId': userId,
        ':isPaidValue': true,
      },
      FilterExpression: '#isPaid = :isPaidValue',
      ExpressionAttributeNames: {
        // '#categoryName': 'category.name',
        '#isPaid': 'isPaid',
      },
      // ProjectionExpression: 'id, #categoryName',
      Limit: 10,
      ScanIndexForward: false,
    })

    const { Items } = await this.dynamodbDocumentClient.send(params)

    return Items as TransactionsTypes[]
  }
  async update(id: string, transaction: UpdateTransactionsType): Promise<void> {
    const params = new UpdateCommand({
      TableName: process.env.TABLE_NAME,
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
