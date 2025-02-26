import { DynamoDB } from '@aws-sdk/client-dynamodb'
import { PutCommand, DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb'

import { TransactionRepositoryInterface } from './interface/transactionRepository.interface'
import { CreateTransactionsType } from '../shared/types'

export class TransactionRepository implements TransactionRepositoryInterface {
  private dynamodbClient: DynamoDB
  private dynamodbDocumentClient: DynamoDBDocumentClient

  constructor() {
    this.dynamodbClient = new DynamoDB()
    this.dynamodbDocumentClient = DynamoDBDocumentClient.from(this.dynamodbClient)
  }

  async create(data: CreateTransactionsType): Promise<void> {
    const params = new PutCommand({
      TableName: process.env.TRANSACTION_TABLE_NAME,
      Item: data,
    })

    await this.dynamodbDocumentClient.send(params)
  }
}
