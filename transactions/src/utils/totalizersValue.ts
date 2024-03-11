import { TransactionsTypes } from '../shared/types'
import { TransactionTypesEnum } from '../enums'

type Totalizers = {
  recipe: number
  expense: number
  totalBalance: number
}

export const totalizersValue = (transactions: TransactionsTypes[]): Totalizers => {
  if (!transactions.length) {
    return {
      recipe: 0,
      expense: 0,
      totalBalance: 0,
    }
  }
  const recipe = transactions
    .filter((transaction) => transaction.type === TransactionTypesEnum.RECIPE)
    .reduce((acc, curr) => acc + curr.value, 0)

  const expense = transactions
    .filter((transaction) => transaction.type === TransactionTypesEnum.EXPENSE)
    .reduce((acc, curr) => acc + curr.value, 0)

  const recipeValue = Number(recipe.toFixed(2))
  const expenseValue = Number(expense.toFixed(2))
  const totalBalance = recipeValue - expenseValue

  const totalizers = {
    recipe: recipeValue,
    expense: expenseValue,
    totalBalance,
  }
  return totalizers
}
