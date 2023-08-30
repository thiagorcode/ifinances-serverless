export type UpdateReportMonthlyType = {
  recipeValue: number;
  expenseValue: number;
  total: number;
};

export type UpdateRecipeValueMonthlyType = Omit<
  UpdateReportMonthlyType,
  'expenseValue'
>;
export type UpdateExpenseValueMonthlyType = Omit<
  UpdateReportMonthlyType,
  'recipeValue'
>;
