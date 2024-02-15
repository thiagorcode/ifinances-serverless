import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import { AppErrorException, formatResponse } from '../utils'
import { ReportsTransactionsMonthlyRepository } from '../repository/reportsTransactionsMonthly.repository'
import { FindReportMonthlyCore } from '../core/findReportMonthly.core'
import { FindReportMonthlyQueryType } from '../shared/types'
import { HttpStatus } from '../enums'

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    console.debug('Event:', event)
    const query = event.queryStringParameters as FindReportMonthlyQueryType

    const repository = new ReportsTransactionsMonthlyRepository()
    const findReportMonthlyCore = new FindReportMonthlyCore(repository, query)

    const reportMonthly = await findReportMonthlyCore.execute()
    return formatResponse(HttpStatus.OK, {
      message: 'Busca realizada com sucesso!',
      reportMonthly,
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
