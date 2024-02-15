import { TransactionsTypes, UpdateDecreaseValueReportsCardType } from '../shared/types'
import { ReportsTransactionsCardRepository } from '../repository/reportsTransactionsCard.repository'
import { TransactionTypesEnum } from '../enums'

export class DecreaseValueReportsTransactionCardCore {
  constructor(private repository: ReportsTransactionsCardRepository) {}

  async execute(transaction: TransactionsTypes) {
    console.info('init DecreaseValueReportsTransactionCardCore service')
    if (!transaction.card?.name || transaction.type === TransactionTypesEnum.RECIPE) return

    try {
      const reportCard = await this.repository.find({
        yearMonth: transaction.yearMonth,
        userId: transaction.userId,
        card: transaction.card.name,
      })
      console.info('reportCard found', reportCard)

      if (reportCard?.id) {
        console.info('call update report card value')
        const updateReportCard: UpdateDecreaseValueReportsCardType = {
          value: reportCard.value - transaction.value,
          quantityTransactions: reportCard.quantityTransactions - 1,
        }

        await this.repository.updateDecreaseReportValue(reportCard.id, updateReportCard)
        return
      }

      return
    } catch (error) {
      console.error(error)
      throw new Error(String(error))
    }
  }
}
