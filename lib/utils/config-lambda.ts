import { NodejsFunctionProps } from 'aws-cdk-lib/aws-lambda-nodejs';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as cdk from 'aws-cdk-lib';

interface LambdaConfiguratorInterface {
  tableName?: string;
}

export class LambdaConfigurator {
  private readonly config: LambdaConfiguratorInterface;

  constructor(config: LambdaConfiguratorInterface) {
    this.config = config;
  }

  public configureLambda(): NodejsFunctionProps {
    const { tableName } = this.config;
    // Update version node
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
        TABLE_DDB: tableName ?? '',
      },
    };
  }
}
