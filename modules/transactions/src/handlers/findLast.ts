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
import { FindLastService } from '../services/findLast.service';

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
    if (!event.pathParameters?.userId) {
      throw new AppErrorException(400, 'Não foi enviado o parâmetro UserId!');
    }
    const userId = event.pathParameters.userId;

    const findLastService = container.resolve(FindLastService);

    const transaction = await findLastService.execute(userId);

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
