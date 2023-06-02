//https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.aws_lambda-readme.html
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as AWS from 'aws-sdk';
//https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.aws_lambda_nodejs-readme.html
import * as lambdaNodeJS from 'aws-cdk-lib/aws-lambda-nodejs';
import { Method } from 'aws-cdk-lib/aws-apigateway';
//https://docs.aws.amazon.com/cdk/api/v2/docs/aws-construct-library.html
import * as cdk from 'aws-cdk-lib';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import { Construct } from 'constructs';
import { LambdaIntegration, RestApi } from 'aws-cdk-lib/aws-apigateway';
import { Stack } from 'aws-cdk-lib';
import { RestApiStack } from './restApi-stack';
interface UserNestedStackProps extends cdk.StackProps {
  stackApi: RestApiStack;
}
export class UsersStack extends cdk.NestedStack {
  readonly getByUserIdFunctionHandler: lambdaNodeJS.NodejsFunction;
  readonly createUserFunctionHandler: lambdaNodeJS.NodejsFunction;
  readonly usersDdb: dynamodb.Table;
  constructor(scope: Construct, id: string, props: UserNestedStackProps) {
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
      tableName: 'finances-users',
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
        functionName: 'finances-get-by-userid',
        runtime: lambda.Runtime.NODEJS_16_X,
        entry: 'modules/users/src/functions/getByUserId/handler.ts',
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
        functionName: 'finances-create-user',
        runtime: lambda.Runtime.NODEJS_16_X,
        entry: 'modules/users/src/functions/create/handler.ts',
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

    const getByUserIdIntegration = new LambdaIntegration(
      this.getByUserIdFunctionHandler
    );
    const createUserIntegration = new LambdaIntegration(
      this.createUserFunctionHandler
    );
    // QUando quiser exportar para cada repositório
    // const restApiId = Stack.of(this).resolve('RestApiFinances');
    // const restApi = RestApi.fromRestApiAttributes(
    //   this,
    //   'FinancesRestApiId',
    //   restApiId
    // );

    const usersResource = props.stackApi.restApi.root.addResource('users');
    usersResource.addMethod('POST', createUserIntegration);
    const userIDResource = usersResource.addResource('{id}');
    userIDResource.addMethod('GET', getByUserIdIntegration);

    new cdk.CfnOutput(this, 'UsersFunctionArn', {
      value: this.getByUserIdFunctionHandler.functionArn,
      exportName: `${this.stackName}-UsersFunctionArn`,
    });
  }
}
