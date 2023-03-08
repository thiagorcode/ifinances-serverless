import * as cdk from 'aws-cdk-lib';
import * as lambdaNodeJS from 'aws-cdk-lib/aws-lambda-nodejs';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import * as cwlogs from 'aws-cdk-lib/aws-logs';
import { Construct } from 'constructs';

interface IFinancesApiStackProps extends cdk.StackProps {
  usersFunctionHandler: lambdaNodeJS.NodejsFunction;
}

export class IFinancesApiStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: IFinancesApiStackProps) {
    super(scope, id, props);

    const logGroup = new cwlogs.LogGroup(this, 'IFinancesApiLogs');
    const api = new apigateway.RestApi(this, 'IFinancesApi', {
      restApiName: 'IFinancesApi',
      deployOptions: {
        stageName: 'dev',
        accessLogDestination: new apigateway.LogGroupLogDestination(logGroup),
        accessLogFormat: apigateway.AccessLogFormat.jsonWithStandardFields({
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

    const usersFunctionIntegration = new apigateway.LambdaIntegration(
      props.usersFunctionHandler
    );

    // "/users"
    const usersResource = api.root.addResource('users');

    // GET /users/{id}
    const productIdResource = usersResource.addResource('{id}');
    productIdResource.addMethod('GET', usersFunctionIntegration);
  }
}
