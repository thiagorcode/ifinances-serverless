import { RestApiStack } from './restApi-stack';
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
import { LambdaIntegration } from 'aws-cdk-lib/aws-apigateway';
import { Effect, PolicyStatement } from 'aws-cdk-lib/aws-iam';
interface TransactionsNestedStackProps extends cdk.StackProps {
  stackApi: RestApiStack;
}

export class TransactionsStack extends cdk.NestedStack {
  readonly createTransactionsFunction: lambdaNodeJS.NodejsFunction;
  readonly findTransactionFunction: lambdaNodeJS.NodejsFunction;
  readonly findAllWithQueryFunction: lambdaNodeJS.NodejsFunction;
  readonly findLastFunction: lambdaNodeJS.NodejsFunction;
  readonly totalizersValueFunction: lambdaNodeJS.NodejsFunction;

  readonly transactionsDdb: dynamodb.Table;
  readonly tableName: string;

  constructor(
    scope: Construct,
    id: string,
    props: TransactionsNestedStackProps
  ) {
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

    this.transactionsDdb.addGlobalSecondaryIndex({
      indexName: 'UserFindIndex',
      partitionKey: {
        name: 'userId',
        type: dynamodb.AttributeType.STRING,
      },
      sortKey: {
        name: 'date',
        type: dynamodb.AttributeType.STRING,
      },
    });

    this.createTransactionsFunction = new lambdaNodeJS.NodejsFunction(
      this,
      'createTransactionsFunctionHandler',
      {
        ...lambdaDefaultConfig,
        functionName: 'finances-transaction-create',
        entry: 'modules/transactions/src/functions/create/handler.ts',
      }
    );

    this.findTransactionFunction = new lambdaNodeJS.NodejsFunction(
      this,
      'findTransactionFunctionHandler',
      {
        ...lambdaDefaultConfig,
        functionName: 'finances-transaction-find',
        entry: 'modules/transactions/src/functions/find/handler.ts',
      }
    );

    this.findAllWithQueryFunction = new lambdaNodeJS.NodejsFunction(
      this,
      'findAllWithQueryFunctionHandler',
      {
        ...lambdaDefaultConfig,
        functionName: 'finances-transaction-find-all-query',
        entry: 'modules/transactions/src/functions/findAllWithQuery/handler.ts',
      }
    );

    this.findLastFunction = new lambdaNodeJS.NodejsFunction(
      this,
      'findLastFunctionHandler',
      {
        ...lambdaDefaultConfig,
        functionName: 'finances-transaction-find-last',
        entry: 'modules/transactions/src/functions/findLast/handler.ts',
      }
    );

    this.totalizersValueFunction = new lambdaNodeJS.NodejsFunction(
      this,
      'totalizersFunctionHandler',
      {
        ...lambdaDefaultConfig,
        functionName: 'finances-transaction-totalizers',
        entry: 'modules/transactions/src/functions/totalizersValue/handler.ts',
      }
    );

    this.transactionsDdb.grantReadData(this.findTransactionFunction);
    this.transactionsDdb.grantReadData(this.findAllWithQueryFunction);
    this.transactionsDdb.grantReadData(this.findLastFunction);
    this.transactionsDdb.grantReadData(this.findLastFunction);
    this.transactionsDdb.grantReadData(this.totalizersValueFunction);
    this.transactionsDdb.grantWriteData(this.createTransactionsFunction);

    const createIntegration = new LambdaIntegration(
      this.createTransactionsFunction
    );
    const findIntegration = new LambdaIntegration(this.findTransactionFunction);
    const findAllWithQueryIntegration = new LambdaIntegration(
      this.findAllWithQueryFunction
    );
    const findLastIntegration = new LambdaIntegration(this.findLastFunction);
    const totalizersIntegration = new LambdaIntegration(
      this.totalizersValueFunction
    );

    const transactionsResource =
      props.stackApi.restApi.root.addResource('transaction');

    transactionsResource.addMethod('POST', createIntegration);

    const transactionsIdResource = transactionsResource.addResource('{id}');
    transactionsIdResource.addMethod('GET', findIntegration);
    // GET - transactions/user/{userId}
    const transactionsUserResource = transactionsResource.addResource('user');
    const transactionsUserIdResource =
      transactionsUserResource.addResource('{userId}');
    transactionsUserIdResource.addMethod('GET', findAllWithQueryIntegration);
    // GET - transactions/user/{userId}/last
    const transactionsUserIdLastResource =
      transactionsUserIdResource.addResource('last');
    transactionsUserIdLastResource.addMethod('GET', findLastIntegration);
    // GET - transactions/user/{userId}/totalizer
    const transactionsUserIdTotalizersResource =
      transactionsUserIdResource.addResource('totalizer');
    transactionsUserIdTotalizersResource.addMethod(
      'GET',
      totalizersIntegration
    );
  }
}
