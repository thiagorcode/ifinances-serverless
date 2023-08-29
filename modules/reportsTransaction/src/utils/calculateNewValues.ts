import { TransactionTypesEnum } from '../enums';

export const calculateNewRecipeValue = (
  type: string,
  currentRecipeValue: number,
  newValue: number
) => {
  if (type === TransactionTypesEnum.RECIPE)
    return currentRecipeValue + newValue;

  return currentRecipeValue;
};

export const calculateNewExpenseValue = (
  type: string,
  currentExpenseValue: number,
  newValue: number
) => {
  if (type === TransactionTypesEnum.EXPENSE)
    return currentExpenseValue + newValue;

  return currentExpenseValue;
};

export const calculateNewTotalValue = (
  type: string,
  currentTotalValue: number,
  newValue: number
) => {
  if (type === TransactionTypesEnum.RECIPE) return currentTotalValue + newValue;
  if (type === TransactionTypesEnum.EXPENSE)
    return currentTotalValue - newValue;

  return 0;
};
