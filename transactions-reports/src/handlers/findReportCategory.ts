import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import { AppErrorException, formatResponse } from '../utils'
import { FindReportMonthlyQueryType } from '../shared/types'
import { HttpStatus } from '../enums'
import { ReportsTransactionsCategoryRepository } from 'src/repository/reportsTransactionsCategory.repository'
import { FindReportCategoryCore } from 'src/core/findReportCategory.core'

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    console.debug('Event:', event)
    const userId = event.requestContext.authorizer?.lambda?.id as string

    if (!userId) {
      throw new AppErrorException(400, 'Não foi enviado o UserId!')
    }

    const query = event.queryStringParameters as Partial<FindReportMonthlyQueryType>

    const repository = new ReportsTransactionsCategoryRepository()
    const findReportMonthlyCore = new FindReportCategoryCore(repository, {
      userId,
      yearMonth: query.yearMonth,
    })

    const reportCategory = await findReportMonthlyCore.execute()
    return formatResponse(HttpStatus.OK, {
      message: 'Busca realizada com sucesso!',
      reportCategory,
    })
  } catch (err) {
    console.error(err)

    if (err instanceof AppErrorException) {
      return formatResponse(err.statusCode, {
        message: err.message,
      })
    }
    return formatResponse(HttpStatus.INTERNAL_SERVER_ERROR, {
      message: 'Erro interno, entre em contato com o administrador!',
    })
  }
}
