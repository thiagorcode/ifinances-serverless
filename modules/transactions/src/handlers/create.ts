import 'reflect-metadata';
import '../shared/container';
import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  Context,
} from 'aws-lambda';
import * as AWS from 'aws-sdk';
import { container } from 'tsyringe';
import { CreateTransactionService } from '../services';
import { AppErrorException } from '../utils/appErrorException';
import { formatJSONResponse } from '../utils/formatResponse';
import { CreateTransactionsDto } from '../repository/types';
export async function handler(
  event: APIGatewayProxyEvent,
  context: Context
): Promise<APIGatewayProxyResult> {
  const lambdaRequestId = context.awsRequestId;
  const apiRequestId = event.requestContext.requestId;
  console.log(
    `API Gateway RequestId: ${apiRequestId} - Lambda RequestId: ${lambdaRequestId}`
  );
  const sqs = new AWS.SQS();
  try {
    const transaction: CreateTransactionsDto = JSON.parse(event.body || '');

    const createTransactionService = container.resolve(
      CreateTransactionService
    );

    const transactionsCreated = await createTransactionService.execute(
      transaction
    );
    const result = await sqs
      .sendMessage({
        DelaySeconds: 3,
        MessageBody: JSON.stringify(transactionsCreated),
        QueueUrl: 'SQSReportsTransactionsQueue',
      })
      .promise();
    console.log('SQS messageId', result.MessageId);
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
