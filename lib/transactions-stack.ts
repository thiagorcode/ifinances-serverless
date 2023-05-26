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
  readonly createTransactionsFunctionHandler: lambdaNodeJS.NodejsFunction;
  readonly findTransactionFunctionHandler: lambdaNodeJS.NodejsFunction;
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

    this.createTransactionsFunctionHandler = new lambdaNodeJS.NodejsFunction(
      this,
      'createTransactionsFunctionHandler',
      {
        ...lambdaDefaultConfig,
        functionName: 'financesCreateTransactionsFunction',
        entry: 'modules/transactions/src/functions/create/handler.ts',
      }
    );

    this.findTransactionFunctionHandler = new lambdaNodeJS.NodejsFunction(
      this,
      'findTransactionFunctionHandler',
      {
        ...lambdaDefaultConfig,
        functionName: 'financesFindTransactionFunction',
        entry: 'modules/transactions/src/functions/find/handler.ts',
      }
    );

    this.transactionsDdb.grantWriteData(this.findTransactionFunctionHandler);
    this.transactionsDdb.grantReadData(this.createTransactionsFunctionHandler);
    new cdk.CfnOutput(this, 'UsersFunctionArn', {
      value: this.createTransactionsFunctionHandler.functionArn,
      exportName: `${this.stackName}-UsersFunctionArn`,
    });
  }
}
