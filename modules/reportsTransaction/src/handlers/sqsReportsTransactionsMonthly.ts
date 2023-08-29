import 'reflect-metadata';
import '../shared/container';
import { SQSEvent, Context } from 'aws-lambda';
import { container } from 'tsyringe';
import { InsertReportMonthlyService } from '../services/insertReportMonthly.service';

export async function handler(
  event: SQSEvent,
  context: Context
): Promise<void> {
  const lambdaRequestId = context.awsRequestId;
  console.log(`Lambda RequestId: ${lambdaRequestId} - `);
  try {
    const insertReportMonthlyService = container.resolve(
      InsertReportMonthlyService
    );

    event.Records.forEach((record) => {
      console.log(`MessageId: ${record.messageId} `);
      const body = JSON.parse(record.body);
      insertReportMonthlyService.execute(body);
    });

    return;
  } catch (error) {
    console.error(error);

    return;
  }
}
