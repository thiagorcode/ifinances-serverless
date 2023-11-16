import { SQSClient, SendMessageCommand } from '@aws-sdk/client-sqs'
import { CreateTransactionsType } from '../shared/types'
import SQSRepositoryInterface from './interface/sqsRepository.interface'

export class SQSRepository implements SQSRepositoryInterface {
  private clientSQS: SQSClient

  constructor() {
    this.clientSQS = new SQSClient()
  }

  async send(transactionsCreated: CreateTransactionsType): Promise<void> {
    const command = new SendMessageCommand({
      DelaySeconds: 3,
      MessageBody: JSON.stringify(transactionsCreated),
      QueueUrl: process.env.REPORTS_TRANSACTIONS_QUEUE_NAME ?? '',
    })
    console.log('send message command: ', command)
    const responseSQS = await this.clientSQS.send(command)
    console.info('response SQS: ', responseSQS)
  }
}
