import * as cdk from 'aws-cdk-lib';
import * as lambdaNodeJS from 'aws-cdk-lib/aws-lambda-nodejs';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import * as cwlogs from 'aws-cdk-lib/aws-logs';
import { Construct } from 'constructs';

interface IFinancesApiStackProps extends cdk.NestedStackProps {
  getByUserIdFunction: lambdaNodeJS.NodejsFunction;
  createUserFunction: lambdaNodeJS.NodejsFunction;
  //transactions
  createTransactionsFunction: lambdaNodeJS.NodejsFunction;
  findTransactionsFunction: lambdaNodeJS.NodejsFunction;
  findLastTransactionsFunction: lambdaNodeJS.NodejsFunction;
  findAllWithQueryTransactionsFunction: lambdaNodeJS.NodejsFunction;
  totalizersValueTransactionsFunction: lambdaNodeJS.NodejsFunction;
}

export class IFinancesApiStack extends cdk.NestedStack {
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

    const resources = [
      { path: 'users', methods: ['POST', 'GET'] },
      { path: 'transactions', methods: ['POST', 'GET'] },
    ];

    const integrations = [
      {
        function: props.getByUserIdFunction,
        resourcePath: 'users/{id}',
        method: 'GET',
      },
      {
        function: props.createUserFunction,
        resourcePath: 'users',
        method: 'POST',
      },
      {
        function: props.createTransactionsFunction,
        resourcePath: 'transactions',
        method: 'POST',
      },
      {
        function: props.findTransactionsFunction,
        resourcePath: 'transactions/{id}',
        method: 'GET',
      },
      {
        function: props.findAllWithQueryTransactionsFunction,
        resourcePath: 'transactions/user/{userId}',
        method: 'GET',
      },
    ];

    for (const resource of resources) {
      const resourceObj = api.root.addResource(resource.path);

      for (const method of resource.methods) {
        const integration = integrations.find(
          (i) => i.resourcePath === resource.path && i.method === method
        );
        if (integration) {
          const lambdaIntegration = new apigateway.LambdaIntegration(
            integration.function
          );
          resourceObj.addMethod(method, lambdaIntegration);
        }
      }
    }
  }
}
