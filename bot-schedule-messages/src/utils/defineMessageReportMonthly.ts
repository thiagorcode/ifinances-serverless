import { ReportTransactionMonthlyType } from '../shared/types'
import { formatCurrencyPtBr } from './formatCurrency'

type DefineMessagesReportMonthlyType = {
  currentReport: ReportTransactionMonthlyType | null
  nextMonthReport: ReportTransactionMonthlyType | null
  currentMonthYear: string
  nextMonthYear: string
}
const positive = (value: number) => value * -1
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
  const currentExpenseValue = positive(currentReport.expenseValue)
  const nextExpenseValue = positive(nextMonthReport.expenseValue)

  if (currentReport?.goal) {
    const currentAmountRemaining = formatCurrencyPtBr(currentReport.goal - currentExpenseValue)
    const currentReportGoal = formatCurrencyPtBr(currentReport.goal)
    message = `Relatório Mensal - ${currentMonthYear}\n\nDespesa total: ${formatCurrencyPtBr(
      currentExpenseValue,
    )}\n Meta de gastos: ${currentReportGoal}\n Valor Sobrando: ${currentAmountRemaining}\n\n`
  }

  if (nextMonthReport?.goal) {
    const nextAmountRemaining = formatCurrencyPtBr(nextMonthReport.goal - nextExpenseValue)
    const nextMonthReportGoal = formatCurrencyPtBr(nextMonthReport.goal)
    message += `Relatório Mensal - ${nextMonthYear}\n\nDespesa total: ${formatCurrencyPtBr(
      nextExpenseValue,
    )}\nMeta de gastos: ${nextMonthReportGoal}\nValor Sobrando: ${nextAmountRemaining}`
  }

  return message
}
