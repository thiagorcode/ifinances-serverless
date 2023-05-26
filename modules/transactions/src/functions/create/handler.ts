import 'reflect-metadata';
import '../../shared/container';
import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  Context,
} from 'aws-lambda';
import { container } from 'tsyringe';
import { CreateTransactionService } from '../../services';
import { AppErrorException } from '../../utils/appErrorException';
import { formatJSONResponse } from '../../utils/formatResponse';
import { TransactionsTypes } from '../../repository/types';

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
    const transaction: TransactionsTypes = JSON.parse(event.body || '');

    const createTransactionService = container.resolve(
      CreateTransactionService
    );

    const transactionsCreated = await createTransactionService.execute(
      transaction
    );

    return formatJSONResponse(201, {
      message: `Transactions created successfully`,
      transaction: transactionsCreated,
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
