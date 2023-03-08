import 'reflect-metadata';
import { findByUserIdService } from '@/services';
import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  Context,
} from 'aws-lambda';
import { formatJSONResponse } from '../../utils/formatResponse';
import '@shared/container';

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
    if (!event.pathParameters) {
      throw new Error('No param id');
    }
    const userId = event.pathParameters.id!;

    const findByUserId = findByUserIdService();

    const user = await findByUserId.execute(userId);

    if (!user) {
      throw new Error('User not exist');
    }

    return formatJSONResponse(200, {
      message: `Consulta realizada com sucesso`,
      data: user,
    });
  } catch (error) {
    console.log(error);
    return formatJSONResponse(500, {
      message: `Error`,
      error: String(error),
    });
  }
}
