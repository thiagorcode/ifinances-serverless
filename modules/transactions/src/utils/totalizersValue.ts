import { TransactionTypesEnum } from '../enums';
import { TransactionsTypes } from '../repository/types';

type Totalizers = {
  recipe: number;
  expense: number;
  totalBalance: number;
};

export const totalizersValue = (
  transactions: TransactionsTypes[]
): Totalizers => {
  const recipe = transactions
    .filter((transaction) => transaction.type === TransactionTypesEnum.RECIPE)
    .reduce((acc, curr) => acc + curr.value, 0);

  const expense = transactions
    .filter((transaction) => transaction.type === TransactionTypesEnum.EXPENSE)
    .reduce((acc, curr) => acc + curr.value, 0);

  const totalBalance = recipe - expense;

  const totalizers = {
    recipe,
    expense,
    totalBalance,
  };
  return totalizers;
};
