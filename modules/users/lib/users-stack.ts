//https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.aws_lambda-readme.html
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as AWS from 'aws-sdk';
//https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.aws_lambda_nodejs-readme.html
import * as lambdaNodeJS from 'aws-cdk-lib/aws-lambda-nodejs';

//https://docs.aws.amazon.com/cdk/api/v2/docs/aws-construct-library.html
import * as cdk from 'aws-cdk-lib';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import { Construct } from 'constructs';
export class UsersStack extends cdk.NestedStack {
  readonly getByUserIdFunctionHandler: lambdaNodeJS.NodejsFunction;
  readonly createUserFunctionHandler: lambdaNodeJS.NodejsFunction;
  readonly usersDdb: dynamodb.Table;

  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // AWS.config.update({
    //   region: 'us-west-2',
    //   dynamodb: {
    //     endpoint: 'http://localhost:8000',
    //   },
    // });

    // const dynamoDB = new AWS.DynamoDB();

    // const params: AWS.DynamoDB.CreateTableInput = {
    //   TableName: 'users',
    //   KeySchema: [{ AttributeName: 'id', KeyType: 'HASH' }],
    //   AttributeDefinitions: [{ AttributeName: 'id', AttributeType: 'S' }],
    //   BillingMode: 'PAY_PER_REQUEST',
    // };

    // dynamoDB.createTable(params, function (err, data) {
    //   if (err) {
    //     console.error('Error creating table: ', err);
    //   } else {
    //     console.log('Table created successfully: ', data);
    //   }
    // });

    this.usersDdb = new dynamodb.Table(this, 'UsersDdb', {
      tableName: 'users',
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      partitionKey: {
        name: 'id',
        type: dynamodb.AttributeType.STRING,
      },
      billingMode: dynamodb.BillingMode.PROVISIONED,
      readCapacity: 1,
      writeCapacity: 1,
    });

    this.getByUserIdFunctionHandler = new lambdaNodeJS.NodejsFunction(
      this,
      'getByUserIdFunctionHandler',
      {
        functionName: 'getByUserIdFunction',
        runtime: lambda.Runtime.NODEJS_16_X,
        entry: '../src/functions/getByUserId/handler.ts',
        handler: 'handler',
        memorySize: 128,
        timeout: cdk.Duration.seconds(5),
        bundling: {
          minify: true,
          sourceMap: false,
        },
        environment: {
          TABLE_DDB: this.usersDdb.tableName,
        },
      }
    );

    this.createUserFunctionHandler = new lambdaNodeJS.NodejsFunction(
      this,
      'createUserFunctionHandler',
      {
        functionName: 'createUserFunction',
        runtime: lambda.Runtime.NODEJS_16_X,
        entry: '../src/functions/create/handler.ts',
        handler: 'handler',
        memorySize: 128,
        timeout: cdk.Duration.seconds(5),
        bundling: {
          minify: true,
          sourceMap: false,
        },
        environment: {
          TABLE_DDB: this.usersDdb.tableName,
        },
      }
    );

    this.usersDdb.grantReadData(this.getByUserIdFunctionHandler);
    this.usersDdb.grantWriteData(this.createUserFunctionHandler);
    new cdk.CfnOutput(this, 'UsersFunctionArn', {
      value: this.getByUserIdFunctionHandler.functionArn,
      exportName: `${this.stackName}-UsersFunctionArn`,
    });
  }
}
