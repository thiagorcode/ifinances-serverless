import 'reflect-metadata';
import '../shared/container';
import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  Context,
} from 'aws-lambda';
import { container } from 'tsyringe';
import { AppErrorException } from '../utils/appErrorException';
import { formatJSONResponse } from '../utils/formatResponse';
import { FindService } from '../services/find.service';

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
    const transactionId = event.pathParameters.id;

    const findService = container.resolve(FindService);

    const transaction = await findService.execute(transactionId);

    return formatJSONResponse(200, {
      message: `Transactions fetched successfully`,
      transaction: transaction,
    });
  } catch (error) {
    console.error(error);

    if (error instanceof AppErrorException) {
      return formatJSONResponse(error.statusCode, {
        message: error.message,
        error: error.dataError,
      });
    }
    return formatJSONResponse(500, {
      message: 'Error',
      error: String(error),
    });
  }
}
