import * as cdk from 'aws-cdk-lib';
import * as cloudformation from 'aws-cdk-lib/aws-cloudformation';
import { Construct } from 'constructs';

import { IFinancesApiStack } from './ifinancesApi-stack';
import { UsersStack } from '../../users/lib/users-stack';

export class CombinedStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const usersStack = new UsersStack(this, 'UsersStack', {
      env: props?.env,
      tags: props?.tags,
    });

    new IFinancesApiStack(this, 'IFinancesApiStack', {
      getByUserIdFunctionHandler: usersStack.getByUserIdFunctionHandler,
      createUserFunctionHandler: usersStack.createUserFunctionHandler,
      // transactions
    });
  }
}
