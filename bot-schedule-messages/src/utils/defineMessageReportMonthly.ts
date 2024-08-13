import { ReportTransactionMonthlyType } from '../shared/types'
import { formatCurrencyPtBr } from './formatCurrency'

type DefineMessagesReportMonthlyType = {
  currentReport: ReportTransactionMonthlyType | null
  nextMonthReport: ReportTransactionMonthlyType | null
  currentMonthYear: string
  nextMonthYear: string
}

export function defineMessageReportMonthly({
  currentMonthYear,
  currentReport,
  nextMonthYear,
  nextMonthReport,
}: DefineMessagesReportMonthlyType): string {
  if (!currentReport?.goal || !nextMonthReport?.goal) {
    return ''
  }
  let message = ''
  if (currentReport?.goal) {
    const currentAmountRemaining = formatCurrencyPtBr(currentReport.goal - currentReport.expenseValue)
    const currentReportGoal = formatCurrencyPtBr(currentReport.goal)
    message = `Relatório Mensal - ${currentMonthYear}\n\nDespesa total: ${formatCurrencyPtBr(
      currentReport.expenseValue,
    )}\n Meta de gastos: ${currentReportGoal}\n Valor Sobrando: ${currentAmountRemaining}\n\n`
  }

  if (nextMonthReport?.goal) {
    const nextAmountRemaining = formatCurrencyPtBr(nextMonthReport.goal - nextMonthReport.expenseValue)
    const nextMonthReportGoal = formatCurrencyPtBr(nextMonthReport.goal)
    message += `Relatório Mensal - ${nextMonthYear}\n\nDespesa total: ${formatCurrencyPtBr(
      nextMonthReport.expenseValue,
    )}\nMeta de gastos: ${nextMonthReportGoal}\nValor Sobrando: ${nextAmountRemaining}`
  }

  return message
}
