import { TransactionTypesEnum } from '../enums'

type CalculateDecreaseValueReportType = {
  type: TransactionTypesEnum
  transactionValue: number
  currentReportRecipeValue: number
  currentReportExpenseValue: number
  currentReportTotal: number
}

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

export const calculateDecreaseValueReport = ({
  type,
  transactionValue,
  currentReportRecipeValue,
  currentReportExpenseValue,
  currentReportTotal,
}: CalculateDecreaseValueReportType) => {
  const decreaseValueRecipe =
    type === TransactionTypesEnum.RECIPE ? currentReportRecipeValue - transactionValue : currentReportRecipeValue
  const decreaseValueExpense =
    type === TransactionTypesEnum.EXPENSE ? currentReportExpenseValue - transactionValue : currentReportExpenseValue
  const decreaseValueTotal =
    type === TransactionTypesEnum.RECIPE ? currentReportTotal - transactionValue : currentReportTotal + transactionValue

  return {
    expense: decreaseValueExpense,
    recipe: decreaseValueRecipe,
    total: decreaseValueTotal,
  }
}
