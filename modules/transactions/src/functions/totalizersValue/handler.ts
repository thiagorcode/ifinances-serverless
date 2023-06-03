import 'reflect-metadata';
import '../../shared/container';
import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  Context,
} from 'aws-lambda';
import { container } from 'tsyringe';
import { AppErrorException } from '../../utils/appErrorException';
import { formatJSONResponse } from '../../utils/formatResponse';
import { TotalizersValueService } from '../../services';
import { FindAllWithQueryDto } from '../../repository/types';
import { findAllWithQuerySchema } from '../../repository/schemas';
import { HttpStatus } from '../../enums/httpStatus';

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

    if (!event.queryStringParameters) {
      throw new Error('Query not valid');
    }

    const query: FindAllWithQueryDto = event.queryStringParameters;
    findAllWithQuerySchema.parse(query);

    const totalizersValueService = container.resolve(TotalizersValueService);

    const totalizers = await totalizersValueService.execute({
      userId,
      categoryId: query.categoryId,
      date: query.date,
      isPaid: query.isPaid,
      type: query.type,
    });

    return formatJSONResponse(HttpStatus.OK, {
      message: 'Totalizers fetched successfully',
      totalizers: totalizers,
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
