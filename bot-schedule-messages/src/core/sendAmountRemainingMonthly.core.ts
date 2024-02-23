import { ReportTransactionMonthlyRepositoryInterface } from '../repository/interface/reportTransactionMonthly.interface'
import { UserBotRepositoryInterface } from '../repository/interface/userBotRepository.interface'

export class SendAmountRemainingMonthlyCore {
  constructor(
    private userBotRepository: UserBotRepositoryInterface,
    private reportMonthlyRepository: ReportTransactionMonthlyRepositoryInterface,
  ) {}

  async execute(): Promise<void> {
    console.info('call ProcessImportDataCore')
  }
}
