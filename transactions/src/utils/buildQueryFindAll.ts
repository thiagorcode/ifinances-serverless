import { FindAllWithQueryType } from '../shared/types'

type ParamsFindAll = {
  filterExpression: string
  expressionAttributesValues: {
    ':type'?: string
    ':startDate'?: string
    ':endDate'?: string
    ':categoryId'?: string
    ':isPaid'?: boolean
  }
  expressionAttributeNames: {
    '#category'?: string
  }
}

const buildFilterExpression = (filterExpression: string, expression: string) => {
  return filterExpression ? ` AND ${expression}` : expression
}

export const buildQueryFindAll = ({
  type,
  startDate,
  endDate,
  categoryId,
  isPaid,
}: Omit<FindAllWithQueryType, 'userId'>) => {
  const params: ParamsFindAll = { filterExpression: '', expressionAttributesValues: {}, expressionAttributeNames: {} }
  if (type !== undefined) {
    params.filterExpression += buildFilterExpression(params.filterExpression, '#type = :type')
    params.expressionAttributesValues[':type'] = type
  }

  if (startDate !== undefined && endDate !== undefined) {
    params.filterExpression += buildFilterExpression(params.filterExpression, '#date BETWEEN :startDate AND :endDate')
    params.expressionAttributesValues[':startDate'] = startDate
    params.expressionAttributesValues[':endDate'] = endDate
  }

  if (categoryId !== undefined) {
    params.filterExpression += buildFilterExpression(params.filterExpression, '#category.id = :categoryId')
    params.expressionAttributesValues[':categoryId'] = categoryId
    params.expressionAttributeNames['#category'] = 'category'
  }

  if (isPaid !== undefined) {
    params.filterExpression += buildFilterExpression(params.filterExpression, 'isPaid = :isPaid')
    params.expressionAttributesValues[':isPaid'] = isPaid
  }
  return params
}
