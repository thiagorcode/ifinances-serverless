#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { CombinedStack } from '../lib/combined-stack';

const app = new cdk.App();

const env: cdk.Environment = {
  account: '735084759467',
  region: 'sa-east-1',
};

const tags = {
  cost: 'IFinances',
  team: 'thiagorsoftwareLTDA',
};
new CombinedStack(app, 'CombinedStack', {
  env,
  tags,
});
app.synth();
