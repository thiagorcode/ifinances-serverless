import EventBridgeRepositoryInterface from '../repository/interface/eventBridgeRepository.interface'
import { SendTransactionsReportsEBridgeType } from '../shared/types'

export class SendTransactionsReportsEventCore {
  constructor(private repositoryEBridge: EventBridgeRepositoryInterface) {}

  async execute(transactionReports: SendTransactionsReportsEBridgeType) {
    console.info('init SendTransactionsReportsEventCore core')

    await this.repositoryEBridge.push(
      transactionReports,
      'lambda.transaction-event',
      process.env.BUS_TRANSACTIONS_NAME ?? '',
      'REPORT',
    )
  }
}
