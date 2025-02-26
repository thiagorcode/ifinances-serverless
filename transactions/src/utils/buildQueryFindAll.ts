import { FindAllWithQueryType } from '../shared/types'

export class QueryBuilder {
  private filterExpression: string
  private expressionAttributesValues: Record<string, string | boolean>
  private expressionAttributeNames: Record<string, string>

  constructor() {
    this.filterExpression = ''
    this.expressionAttributesValues = {}
    this.expressionAttributeNames = {}
  }

  private buildFilterExpression(expression: string) {
    this.filterExpression += this.filterExpression ? ` AND ${expression}` : expression
  }

  public buildQueryFindAll({
    type,
    startDate,
    endDate,
    categoryId,
    isPaid,
    cardId,
    yearMonth,
  }: Omit<FindAllWithQueryType, 'userId'>) {
    if (type !== undefined) {
      this.buildFilterExpression('#type = :type')
      this.expressionAttributesValues[':type'] = type
    }

    if (startDate !== undefined && endDate !== undefined) {
      this.buildFilterExpression('#date BETWEEN :startDate AND :endDate')
      this.expressionAttributesValues[':startDate'] = startDate
      this.expressionAttributesValues[':endDate'] = endDate + 'T23:59:59'
    }

    if (categoryId !== undefined) {
      this.buildFilterExpression('#category.id = :categoryId')
      this.expressionAttributesValues[':categoryId'] = categoryId
      this.expressionAttributeNames['#category'] = 'category'
    }

    if (cardId !== undefined) {
      this.buildFilterExpression('#card.id = :cardId')
      this.expressionAttributesValues[':cardId'] = cardId
      this.expressionAttributeNames['#card'] = 'card'
    }

    if (isPaid !== undefined) {
      this.buildFilterExpression('isPaid = :isPaid')
      this.expressionAttributesValues[':isPaid'] = isPaid
    }

    if (yearMonth !== undefined) {
      this.buildFilterExpression('yearMonth = :yearMonth')
      this.expressionAttributesValues[':yearMonth'] = yearMonth
    }

    const params = {
      filterExpression: this.filterExpression,
      expressionAttributesValues: this.expressionAttributesValues,
      expressionAttributeNames: this.expressionAttributeNames,
    }
    return params
  }
}
