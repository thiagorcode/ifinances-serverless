#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { UsersStack } from '../lib/users-stack';
import { IFinancesApiStack } from '../lib/ifinancesApi-stack';

const app = new cdk.App();

const env: cdk.Environment = {
  account: '735084759467',
  region: 'sa-east-1',
};

const tags = {
  cost: 'IFinances',
  team: 'thiagorsoftwareLTDA',
};

const usersAppStack = new UsersStack(app, 'UsersApp', {
  tags: tags,
  env: env,
});

const iFinancesApiStack = new IFinancesApiStack(app, 'IFinancesApi', {
  usersFunctionHandler: usersAppStack.usersFunctionHandler,
  tags: tags,
  env: env,
});
iFinancesApiStack.addDependency(usersAppStack);
