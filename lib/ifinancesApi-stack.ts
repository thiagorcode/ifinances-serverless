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
      { path: 'users/{id+}', methods: ['GET'] },
      { path: 'transactions', methods: ['POST', 'GET'] },
      { path: 'transactions/{id+}', methods: ['GET'] },
      { path: 'transactions/user/{userId+}', methods: ['GET'] },
    ];
    const integrations = [
      {
        path: 'users',
        methods: [
          { httpMethod: 'POST', functionHandler: props.createUserFunction },
          {
            httpMethod: 'GET',
            path: '{id}',
            functionHandler: props.getByUserIdFunction,
          },
        ],
      },
      {
        path: 'transactions',
        methods: [
          {
            httpMethod: 'POST',
            functionHandler: props.createTransactionsFunction,
          },
          {
            httpMethod: 'GET',
            path: '{id}',
            functionHandler: props.findTransactionsFunction,
          },
          {
            httpMethod: 'GET',
            path: 'user/{userId}/last',
            functionHandler: props.findLastTransactionsFunction,
          },
        ],
      },
    ];

    for (const integration of integrations) {
      const resource = api.root.addResource(integration.path);

      for (const method of integration.methods) {
        const integrationFunction = new apigateway.LambdaIntegration(
          method.functionHandler
        );
        resource.addMethod(method.httpMethod, integrationFunction, {
          authorizationType: apigateway.AuthorizationType.NONE,
          methodResponses: [{ statusCode: '200' }],
        });
      }
    }
  }
}
