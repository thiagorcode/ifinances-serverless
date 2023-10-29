import 'reflect-metadata';
import '../shared/container';
import { SQSEvent, Context } from 'aws-lambda';
import { container } from 'tsyringe';
import { InsertReportMonthlyService } from '../services/insertReportMonthly.service';

export async function handler(event: SQSEvent, context: Context): Promise<{}> {
  const lambdaRequestId = context.awsRequestId;
  console.log(`Lambda RequestId: ${lambdaRequestId} - `);
  const insertReportMonthlyService = container.resolve(
    InsertReportMonthlyService
  );
  const recordPromises = event.Records.map(async (record) => {
    console.log(`MessageId: ${record.messageId} `);
    // usar outra coisa sem ser JSON.parse
    const body = JSON.parse(record.body);
    // const body: any = record.body;
    await insertReportMonthlyService.execute(body);
  });
  const resultPromises = await Promise.allSettled(recordPromises);
  console.debug('resultPromises: ', resultPromises);

  return resultPromises;
}
