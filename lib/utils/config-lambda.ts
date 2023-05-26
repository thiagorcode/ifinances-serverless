import { NodejsFunctionProps } from 'aws-cdk-lib/aws-lambda-nodejs';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as cdk from 'aws-cdk-lib';

export class LambdaConfigurator {
  private readonly tableName: string;

  constructor(tableName: string) {
    this.tableName = tableName;
  }

  public configureLambda(): NodejsFunctionProps {
    const { tableName } = this;

    return {
      runtime: lambda.Runtime.NODEJS_16_X,
      handler: 'handler',
      memorySize: 128,
      timeout: cdk.Duration.seconds(5),
      bundling: {
        minify: true,
        sourceMap: false,
      },
      environment: {
        TABLE_DDB: tableName,
      },
    };
  }
}
