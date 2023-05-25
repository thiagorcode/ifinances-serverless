import 'reflect-metadata';
import { CreateUserService } from '@/services';
import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  Context,
} from 'aws-lambda';
import '@shared/container';
import { AppErrorException } from '@/utils/appErrorException';
import { formatJSONResponse } from '@/utils/formatResponse';
import { UsersTypes } from '@/repository/types';
import { container } from 'tsyringe';

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
    const user: UsersTypes = JSON.parse(event.body || '');

    const createUserService = container.resolve(CreateUserService);

    const userCreated = await createUserService.execute(user);

    return formatJSONResponse(200, {
      message: `Usuário criado com sucesso!`,
      data: userCreated,
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
