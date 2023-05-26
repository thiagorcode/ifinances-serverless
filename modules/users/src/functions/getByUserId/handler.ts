import 'reflect-metadata';
import '../../shared/container';
import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  Context,
} from 'aws-lambda';
import { findByUserIdService } from '../../services';
import { AppErrorException } from '../../utils/appErrorException';
import { formatJSONResponse } from '../../utils/formatResponse';

export async function handler(
  event: APIGatewayProxyEvent,
  context: Context
): Promise<APIGatewayProxyResult> {
  const lambdaRequestId = context.awsRequestId;
  const apiRequestId = event.requestContext.requestId;

  console.log(
    `API Gateway RequestId: ${apiRequestId} - Lambda RequestId: ${lambdaRequestId}`
  );
  try {
    if (!event.pathParameters?.id) {
      throw new AppErrorException(400, 'Não foi enviado o parâmetro ID!');
    }
    const userId = event.pathParameters.id;

    const findByUserId = findByUserIdService();

    const user = await findByUserId.execute(userId);

    if (!user) {
      throw new AppErrorException(400, 'Usuário não existe!');
    }

    return formatJSONResponse(200, {
      message: `Consulta realizada com sucesso`,
      user: user,
    });
  } catch (error) {
    console.error(error);

    if (error instanceof AppErrorException) {
      return formatJSONResponse(error.statusCode, {
        message: error.message,
      });
    }
    return formatJSONResponse(500, {
      message: 'Error',
      error: String(error),
    });
  }
}
