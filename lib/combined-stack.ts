import * as cdk from 'aws-cdk-lib';
import * as cloudformation from 'aws-cdk-lib/aws-cloudformation';
import { Construct } from 'constructs';

import { IFinancesApiStack } from './ifinancesApi-stack';
import { UsersStack } from './users-stack';
import { TransactionsStack } from './transactions-stack';

export class CombinedStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const usersStack = new UsersStack(this, 'UsersStack', {
      env: props?.env,
      tags: props?.tags,
    });

    const transactionsStack = new TransactionsStack(this, 'TransactionsStack', {
      env: props?.env,
      tags: props?.tags,
    });

    new IFinancesApiStack(this, 'IFinancesApiStack', {
      getByUserIdFunction: usersStack.getByUserIdFunctionHandler,
      createUserFunction: usersStack.createUserFunctionHandler,
      // transactions
      createTransactionsFunction: transactionsStack.createTransactionsFunction,
      findTransactionsFunction: transactionsStack.findTransactionFunction,
      findAllWithQueryTransactionsFunction:
        transactionsStack.findAllWithQueryFunction,
      findLastTransactionsFunction: transactionsStack.findLastFunction,
      totalizersValueTransactionsFunction:
        transactionsStack.totalizersValueFunction,
    });
  }
}
