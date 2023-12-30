import { SendTransactionsReportsSQSType } from '../shared/types'
import { SQSRepository } from '../repository/sqs.repository'

export class SendTransactionsReportsSQSCore {
  constructor(private repositorySQS: SQSRepository) {}

  async execute(transactionReports: SendTransactionsReportsSQSType) {
    console.info('init SendTransactionsReportsSQSCore core')

    await this.repositorySQS.send(transactionReports, process.env.REPORTS_TRANSACTIONS_MONTHLY_QUEUE_NAME)
    await this.repositorySQS.send(transactionReports, process.env.REPORTS_TRANSACTIONS_CATEGORY_QUEUE_NAME)
    await this.repositorySQS.send(transactionReports, process.env.REPORTS_TRANSACTIONS_CARD_QUEUE_NAME)
  }
}
