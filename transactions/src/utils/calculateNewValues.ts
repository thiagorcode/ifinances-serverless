import { TransactionTypesEnum } from '../enums'

export const calculateUpdateValueReport = (
  type: string,
  transactionValue: number,
  currentReportValue: number,
  currentReportTotalValue: number,
) => {
  const recipeValue = type === TransactionTypesEnum.RECIPE ? currentReportValue + transactionValue : currentReportValue
  const expenseValue =
    type === TransactionTypesEnum.EXPENSE ? currentReportValue - transactionValue : currentReportValue
  const totalValue =
    type === TransactionTypesEnum.RECIPE
      ? currentReportTotalValue + transactionValue
      : currentReportTotalValue - transactionValue

  return {
    expense: expenseValue,
    recipe: recipeValue,
    total: totalValue,
  }
}

export const calculateNewValueReport = (type: string, transactionValue: number) => {
  const recipeValue = type === TransactionTypesEnum.RECIPE ? transactionValue : 0
  const expenseValue = type === TransactionTypesEnum.EXPENSE ? -transactionValue : 0
  const totalValue = type === TransactionTypesEnum.RECIPE ? transactionValue : -transactionValue

  return {
    expense: expenseValue,
    recipe: recipeValue,
    total: totalValue,
  }
}
