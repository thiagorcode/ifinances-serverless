import { Stack, StackProps, CfnOutput } from 'aws-cdk-lib';
import {
  RestApi,
  LambdaIntegration,
  LogGroupLogDestination,
  AccessLogFormat,
} from 'aws-cdk-lib/aws-apigateway';
import { LogGroup } from 'aws-cdk-lib/aws-logs';
import { Construct } from 'constructs';

export class RestApiStack extends Stack {
  public readonly restApi: RestApi;

  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const logGroup = new LogGroup(this, 'IFinancesApiLogs');

    this.restApi = new RestApi(this, 'RestApiFinances', {
      restApiName: 'API Finances',
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

    new CfnOutput(this, 'FinancesRestApiIdOutput', {
      value: this.restApi.restApiId,
      exportName: 'FinancesRestApiId',
    });
  }
}
