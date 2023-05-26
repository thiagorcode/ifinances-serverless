//https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.aws_lambda-readme.html
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as AWS from 'aws-sdk';
//https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.aws_lambda_nodejs-readme.html
import * as lambdaNodeJS from 'aws-cdk-lib/aws-lambda-nodejs';

//https://docs.aws.amazon.com/cdk/api/v2/docs/aws-construct-library.html
import * as cdk from 'aws-cdk-lib';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import { Construct } from 'constructs';
export class TransactionsStack extends cdk.NestedStack {
  readonly createTransactionsFunctionHandler: lambdaNodeJS.NodejsFunction;
  readonly transactionsDdb: dynamodb.Table;

  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    this.transactionsDdb = new dynamodb.Table(this, 'TransactionsDdb', {
      tableName: 'finances-transactions',
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
        functionName: 'financesCreateTransactionsFunction',
        runtime: lambda.Runtime.NODEJS_16_X,
        entry: 'modules/transactions/src/functions/create/handler.ts',
        handler: 'handler',
        memorySize: 128,
        timeout: cdk.Duration.seconds(5),
        bundling: {
          minify: true,
          sourceMap: false,
        },
        environment: {
          TABLE_DDB: this.transactionsDdb.tableName,
        },
      }
    );

    this.transactionsDdb.grantWriteData(this.createTransactionsFunctionHandler);
    new cdk.CfnOutput(this, 'UsersFunctionArn', {
      value: this.createTransactionsFunctionHandler.functionArn,
      exportName: `${this.stackName}-UsersFunctionArn`,
    });
  }
}
