import * as cdk from 'aws-cdk-lib';
import * as cloudformation from 'aws-cdk-lib/aws-cloudformation';
import { Construct } from 'constructs';

import { IFinancesApiStack } from './ifinancesApi-stack';
import { UsersStack } from './users-stack';
import { TransactionsStack } from './transactions-stack';
import {
  AccessLogFormat,
  LogGroupLogDestination,
  RestApi,
} from 'aws-cdk-lib/aws-apigateway';
import { LogGroup } from 'aws-cdk-lib/aws-logs';

export class CombinedStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);
    const logGroup = new LogGroup(this, 'IFinancesApiLogs');

    const restApi = new RestApi(this, 'RestApiFinances', {
      cloudWatchRole: true,
      restApiName: 'IFinancesApi',
      deployOptions: {
        stageName: 'dev',
        accessLogDestination: new LogGroupLogDestination(logGroup),
        accessLogFormat: AccessLogFormat.jsonWithStandardFields({
          httpMethod: true,
          ip: true,
          protocol: true,
          requestTime: true,
          resourcePath: true,
          responseLength: true,
          status: true,
          caller: true,
          user: true,
        }),
      },
    });

    const usersStack = new UsersStack(this, 'UsersStack', {
      env: props?.env,
      tags: props?.tags,
      restApiId: restApi.restApiId,
      rootResourceId: restApi.restApiRootResourceId,
    });

    const transactionsStack = new TransactionsStack(this, 'TransactionsStack', {
      env: props?.env,
      tags: props?.tags,
      restApiId: restApi.restApiId,
      rootResourceId: restApi.restApiRootResourceId,
    });

    // new IFinancesApiStack(this, 'IFinancesApiStack', {
    //   getByUserIdFunction: usersStack.getByUserIdFunctionHandler,
    //   createUserFunction: usersStack.createUserFunctionHandler,
    //   // transactions
    //   createTransactionsFunction: transactionsStack.createTransactionsFunction,
    //   findTransactionsFunction: transactionsStack.findTransactionFunction,
    //   findAllWithQueryTransactionsFunction:
    //     transactionsStack.findAllWithQueryFunction,
    //   findLastTransactionsFunction: transactionsStack.findLastFunction,
    //   totalizersValueTransactionsFunction:
    //     transactionsStack.totalizersValueFunction,
    // });
  }
}
