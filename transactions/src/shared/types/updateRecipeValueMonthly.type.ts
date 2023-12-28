export type UpdateReportMonthlyType = {
  recipeValue: number
  expenseValue: number
  total: number
  quantityTransactions: number
  yearMonth: string
}

export type UpdateRecipeValueMonthlyType = Omit<UpdateReportMonthlyType, 'expenseValue'>
export type UpdateExpenseValueMonthlyType = Omit<UpdateReportMonthlyType, 'recipeValue'>
