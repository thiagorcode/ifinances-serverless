import { destr } from 'destr'
import { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from 'aws-lambda'
import { AppErrorException, formatResponse } from '../utils'
export const handler = async (event: APIGatewayProxyEvent, context: Context): Promise<APIGatewayProxyResult> => {
  // adicionar uma tabela de evento
  try {
    console.debug('Event:', event)
    if (!event.body) {
      throw new AppErrorException(400, 'Body not found!')
    }
    const body = destr(event.body)

    console.debug('Body:', body)
    // const repository = new DynamoDBRepository()
    // const createUserCore = new CreateCore(repository)

    // await createUserCore.execute(body)
    return formatResponse(200, {
      message: 'teste',
    })
  } catch (err) {
    return formatResponse(500, {
      message: 'Erro inesperado',
      err,
    })
  }
}
