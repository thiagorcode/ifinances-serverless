import { SQSClient, SendMessageCommand } from '@aws-sdk/client-sqs'
import { SQSRepositoryInterface } from './interface/sqsRepository.interface'

export class SQSRepository implements SQSRepositoryInterface {
  private clientSQS: SQSClient

  constructor() {
    this.clientSQS = new SQSClient()
  }

  async send<T>(data: T, queueName?: string): Promise<void> {
    const command = new SendMessageCommand({
      DelaySeconds: 3,
      MessageBody: JSON.stringify(data),
      QueueUrl: queueName ?? '',
    })
    console.log('send message command: ', command)
    const responseSQS = await this.clientSQS.send(command)
    console.info('response SQS: ', responseSQS)
  }
}
