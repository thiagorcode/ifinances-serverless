import { SQSRepository } from '../repository/sqs.repository'
import { StreamRecord } from 'aws-lambda'

export class SendTransactionsReportsSQSCore {
  constructor(private repository: SQSRepository) {}

  async execute(data: StreamRecord) {
    console.info('init SendTransactionsReportsSQSCore core')

    await this.repository.send(data.NewImage, process.env.REPORTS_TRANSACTIONS_MONTHLY_QUEUE_NAME)
    await this.repository.send(data.NewImage, process.env.REPORTS_TRANSACTIONS_CATEGORY_QUEUE_NAME)
    await this.repository.send(data.NewImage, process.env.REPORTS_TRANSACTIONS_CARD_QUEUE_NAME)
  }
}
