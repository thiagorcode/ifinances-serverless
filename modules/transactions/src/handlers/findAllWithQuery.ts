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
import {
  FindAllWithQueryDto,
  FindAllWithQueryOriginDto,
} from '../repository/types';
import { findAllWithQuerySchema } from '../repository/schemas';
import { FindAllWithQueryService } from '../services/findAllWithQuery.service';

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
    const userId = event.pathParameters?.userId;
    if (!userId) {
      throw new AppErrorException(400, 'Não foi enviado o parâmetro ID!');
    }

    console.log('path query', event.queryStringParameters);

    const query = event.queryStringParameters as FindAllWithQueryOriginDto;

    const findAllWithQueryService = container.resolve(FindAllWithQueryService);

    const transactions = await findAllWithQueryService.execute({
      userId,
      categoryId: query?.categoryId,
      date: query?.date,
      isPaid: query?.isPaid,
      type: query?.type,
    });

    return formatJSONResponse(200, {
      message: `Transactions fetched successfully`,
      transactions,
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
