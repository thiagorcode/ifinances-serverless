import { ReportTransactionMonthlyType } from '../shared/types'

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
  if (currentReport?.goal && nextMonthReport?.goal) {
    return `Relatório Mensal - ${currentMonthYear}\nDespesa total: ${positive(
      currentReport.expenseValue,
    )}\nMeta de gastos: ${currentReport.goal}\nValor Sobrando: ${
      currentReport.goal - positive(currentReport.expenseValue)
    }\n\nRelatório Mensal - ${nextMonthYear}\nDespesa total: ${positive(
      nextMonthReport.expenseValue,
    )}\nMeta de gastos: ${nextMonthReport.goal}\nValor Sobrando: ${
      nextMonthReport.goal - positive(nextMonthReport.expenseValue)
    }`
  }
  if (currentReport?.goal) {
    return `Relatório Mensal - ${currentMonthYear}\n Despesa total: ${positive(
      currentReport.expenseValue,
    )}\n Meta de gastos: ${currentReport.goal}\n Valor Sobrando: ${
      currentReport.goal - positive(currentReport.expenseValue)
    }\n\n`
  }
  if (nextMonthReport?.goal) {
    return `Relatório Mensal - ${nextMonthYear}\nDespesa total: ${positive(
      nextMonthReport.expenseValue,
    )}\nMeta de gastos: ${nextMonthReport.goal}\nValor Sobrando: ${
      nextMonthReport.goal - positive(nextMonthReport.expenseValue)
    }`
  }

  return ''
}
