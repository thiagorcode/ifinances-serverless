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

export class TransactionsCategoryStack extends cdk.NestedStack {
  readonly findTransactionCategoryFunction: lambdaNodeJS.NodejsFunction;
  readonly findAllTransactionCategoryFunction: lambdaNodeJS.NodejsFunction;

  readonly transactionsDdb: dynamodb.Table;
  readonly tableName: string;

  constructor(
    scope: Construct,
    id: string,
    props: TransactionsNestedStackProps
  ) {
    super(scope, id, props);

    this.tableName = 'finances-transactions-category';
    const lambdaConfigurator = new LambdaConfigurator({
      tableName: this.tableName,
    });
    const lambdaDefaultConfig = lambdaConfigurator.configureLambda();

    this.transactionsDdb = new dynamodb.Table(this, 'TransactionsCategoryDdb', {
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

    this.findTransactionCategoryFunction = new lambdaNodeJS.NodejsFunction(
      this,
      'findTransactionTransactionFunctionHandler',
      {
        ...lambdaDefaultConfig,
        functionName: 'finances-transaction-category-find',
        entry: 'modules/transactionsCategory/src/handlers/find.ts',
      }
    );

    this.findAllTransactionCategoryFunction = new lambdaNodeJS.NodejsFunction(
      this,
      'findAllTransactionCategoryFunctionHandler',
      {
        ...lambdaDefaultConfig,
        functionName: 'finances-transaction-category-find-all',
        entry: 'modules/transactionsCategory/src/handlers/findAll.ts',
      }
    );

    this.transactionsDdb.grantReadData(this.findTransactionCategoryFunction);
    this.transactionsDdb.grantReadData(this.findAllTransactionCategoryFunction);

    const findIntegration = new LambdaIntegration(
      this.findTransactionCategoryFunction
    );
    const findAll = new LambdaIntegration(
      this.findAllTransactionCategoryFunction
    );

    const transactionsResource = props.stackApi.restApi.root.addResource(
      'transactions-category'
    );

    const transactionsCategoryFindResource =
      transactionsResource.addResource('find');
    const transactionsCategoryIdResource =
      transactionsCategoryFindResource.addResource('{id}');

    transactionsCategoryIdResource.addMethod('GET', findIntegration);

    transactionsResource.addMethod('GET', findAll);
  }
}
