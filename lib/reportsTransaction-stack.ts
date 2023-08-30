import { RestApiStack } from './restApi-stack';
//https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.aws_lambda-readme.html
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as AWS from 'aws-sdk';
//https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.aws_lambda_nodejs-readme.html
import * as lambdaNodeJS from 'aws-cdk-lib/aws-lambda-nodejs';
//https://docs.aws.amazon.com/cdk/api/v2/docs/aws-construct-library.html
import * as cdk from 'aws-cdk-lib';
import * as sqs from 'aws-cdk-lib/aws-sqs';
import * as lambdaEventSources from 'aws-cdk-lib/aws-lambda-event-sources';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import { Construct } from 'constructs';
import { LambdaConfigurator } from './utils/config-lambda';
import { LambdaIntegration } from 'aws-cdk-lib/aws-apigateway';

export class ReportsTransactionStack extends cdk.NestedStack {
  readonly reportsTransactionsMonthlyFunction: lambdaNodeJS.NodejsFunction;
  readonly transactionsEventsQueue: sqs.Queue;

  public readonly transactionsEventsQueueUrl: string;
  readonly reportsTransactionMonthlyDdb: dynamodb.Table;
  readonly tableName: string;
  constructor(scope: Construct, id: string, props: cdk.StackProps) {
    super(scope, id, props);

    this.tableName = 'finances-reports-transactions-monthly';
    const lambdaConfigurator = new LambdaConfigurator({
      tableName: this.tableName,
    });
    const lambdaDefaultConfig = lambdaConfigurator.configureLambda();

    this.transactionsEventsQueue = new sqs.Queue(
      this,
      'SqsReportsTransactions',
      {
        queueName: 'SQSReportsTransactionsQueue',
        enforceSSL: false,
        encryption: sqs.QueueEncryption.UNENCRYPTED,
      }
    );
    this.transactionsEventsQueueUrl = this.transactionsEventsQueue.queueUrl;

    this.reportsTransactionMonthlyDdb = new dynamodb.Table(
      this,
      'ReportsTransactionsMonthlyDdb',
      {
        tableName: this.tableName,
        removalPolicy: cdk.RemovalPolicy.DESTROY,
        partitionKey: {
          name: 'id',
          type: dynamodb.AttributeType.STRING,
        },
        billingMode: dynamodb.BillingMode.PROVISIONED,
        readCapacity: 1,
        writeCapacity: 1,
      }
    );

    this.reportsTransactionsMonthlyFunction = new lambdaNodeJS.NodejsFunction(
      this,
      'reportsTransactionsMonthlyFunctionHandler',
      {
        ...lambdaDefaultConfig,
        functionName: 'finances-sqsreports-transactions-monthly',
        entry:
          'modules/reportsTransaction/src/handlers/sqsReportsTransactionsMonthly.ts',
      }
    );

    this.reportsTransactionsMonthlyFunction.addEventSource(
      new lambdaEventSources.SqsEventSource(this.transactionsEventsQueue)
    );
    this.transactionsEventsQueue.grantConsumeMessages(
      this.reportsTransactionsMonthlyFunction
    );

    this.reportsTransactionMonthlyDdb.grantWriteData(
      this.reportsTransactionsMonthlyFunction
    );
  }
}
