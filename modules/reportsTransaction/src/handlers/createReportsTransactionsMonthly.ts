import 'reflect-metadata';
import '../shared/container';
import { SQSEvent, Context, APIGatewayProxyEvent } from 'aws-lambda';
import { container } from 'tsyringe';
import { InsertReportMonthlyService } from '../services/insertReportMonthly.service';
import { AppErrorException } from '../utils/appErrorException';
import { formatJSONResponse } from '../utils/formatResponse';

export async function handler(
  event: APIGatewayProxyEvent,
  context: Context
): Promise<{}> {
  const lambdaRequestId = context.awsRequestId;
  console.log(`Lambda RequestId: ${lambdaRequestId} - `);
  try {
    const insertReportMonthlyService = container.resolve(
      InsertReportMonthlyService
    );
    // usar outra coisa sem ser JSON.parse
    const body = JSON.parse(event.body ?? '');
    // const body: any = record.body;
    await insertReportMonthlyService.execute(body);

    return formatJSONResponse(201, {
      message: `Transactions Report successfully`,
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
