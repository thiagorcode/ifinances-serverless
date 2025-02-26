import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
// import { ProcessImportDataCore } from '../core'
import { ProcessCsvTransactionCore } from '../core/processCsvTransaction.core'
import { formatResponse } from '../utils'
import destr from 'destr'

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    console.info('Event :: ', JSON.stringify(event))

    if (!event.body) {
      return formatResponse(400, {
        message: 'Necessário enviar um arquivo!',
      })
    }
    const body = destr<string>(event.body)
    const processCsvTransactionCore = new ProcessCsvTransactionCore()
    const result = await processCsvTransactionCore.execute(body, event.headers)
    console.info(result)
    // const processImportDataCore = new ProcessImportDataCore()

    // await processImportDataCore.execute(event)

    return formatResponse(200, {
      message: 'Importação realizada com sucesso',
      result,
    })
  } catch (error) {
    console.error(error)
    return formatResponse(500, {
      message: 'Erro inesperado!',
    })
  }
}
