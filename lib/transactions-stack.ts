//https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.aws_lambda-readme.html
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as AWS from 'aws-sdk';
//https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.aws_lambda_nodejs-readme.html
import * as lambdaNodeJS from 'aws-cdk-lib/aws-lambda-nodejs';

//https://docs.aws.amazon.com/cdk/api/v2/docs/aws-construct-library.html
import * as cdk from 'aws-cdk-lib';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import { Construct } from 'constructs';
import { LambdaConfigurator } from './utils/config-lambda';
export class TransactionsStack extends cdk.NestedStack {
  readonly createTransactionsFunction: lambdaNodeJS.NodejsFunction;
  readonly findTransactionFunction: lambdaNodeJS.NodejsFunction;
  readonly findAllWithQueryFunction: lambdaNodeJS.NodejsFunction;
  readonly findLastFunction: lambdaNodeJS.NodejsFunction;
  readonly totalizersValueFunction: lambdaNodeJS.NodejsFunction;

  readonly transactionsDdb: dynamodb.Table;
  readonly tableName: string;

  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    this.tableName = 'finances-transactions';
    const lambdaConfigurator = new LambdaConfigurator(this.tableName);
    const lambdaDefaultConfig = lambdaConfigurator.configureLambda();

    this.transactionsDdb = new dynamodb.Table(this, 'TransactionsDdb', {
      tableName: this.tableName,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      partitionKey: {
        name: 'id',
        type: dynamodb.AttributeType.STRING,
      },
      billingMode: dynamodb.BillingMode.PROVISIONED,
      readCapacity: 1,
      writeCapacity: 1,
    });

    this.createTransactionsFunction = new lambdaNodeJS.NodejsFunction(
      this,
      'createTransactionsFunctionHandler',
      {
        ...lambdaDefaultConfig,
        functionName: 'finances-create-transaction',
        entry: 'modules/transactions/src/functions/create/handler.ts',
      }
    );

    this.findTransactionFunction = new lambdaNodeJS.NodejsFunction(
      this,
      'findTransactionFunctionHandler',
      {
        ...lambdaDefaultConfig,
        functionName: 'finances-find-transaction',
        entry: 'modules/transactions/src/functions/find/handler.ts',
      }
    );

    this.findAllWithQueryFunction = new lambdaNodeJS.NodejsFunction(
      this,
      'findAllWithQueryFunctionHandler',
      {
        ...lambdaDefaultConfig,
        functionName: 'finances-find-all-query-transaction',
        entry: 'modules/transactions/src/functions/findAllWithQuery/handler.ts',
      }
    );

    // this.findLastFunction = new lambdaNodeJS.NodejsFunction(
    //   this,
    //   'findLastFunctionHandler',
    //   {
    //     ...lambdaDefaultConfig,
    //     functionName: 'finances-find-last-transaction',
    //     entry: 'modules/transactions/src/functions/findLast/handler.ts',
    //   }
    // );

    // this.totalizersValueFunction = new lambdaNodeJS.NodejsFunction(
    //   this,
    //   'totalizersValueFunctionHandler',
    //   {
    //     ...lambdaDefaultConfig,
    //     functionName: 'finances-find-last-transaction',
    //     entry: 'modules/transactions/src/functions/totalizersValue/handler.ts',
    //   }
    // );

    this.transactionsDdb.grantReadData(this.findTransactionFunction);
    this.transactionsDdb.grantReadData(this.findAllWithQueryFunction);
    // this.transactionsDdb.grantReadData(this.findLastFunction);
    // this.transactionsDdb.grantReadData(this.totalizersValueFunction);

    this.transactionsDdb.grantWriteData(this.createTransactionsFunction);

    new cdk.CfnOutput(this, 'UsersFunctionArn', {
      value: this.createTransactionsFunction.functionArn,
      exportName: `${this.stackName}-TransactionsFunctionArn`,
    });
  }
}
