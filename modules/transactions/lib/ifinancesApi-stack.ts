// import * as cdk from 'aws-cdk-lib';
// import * as lambdaNodeJS from 'aws-cdk-lib/aws-lambda-nodejs';
// import * as apigateway from 'aws-cdk-lib/aws-apigateway';
// import * as cwlogs from 'aws-cdk-lib/aws-logs';
// import { Construct } from 'constructs';

// interface IFinancesApiStackProps extends cdk.NestedStackProps {
//   getByUserIdFunctionHandler: lambdaNodeJS.NodejsFunction;
//   createUserFunctionHandler: lambdaNodeJS.NodejsFunction;
// }

// export class IFinancesApiStack extends cdk.NestedStack {
//   constructor(scope: Construct, id: string, props: IFinancesApiStackProps) {
//     super(scope, id, props);

//     const logGroup = new cwlogs.LogGroup(this, 'IFinancesApiLogs');
//     const api = new apigateway.RestApi(this, 'IFinancesApi', {
//       restApiName: 'IFinancesApi',
//       deployOptions: {
//         stageName: 'dev',
//         accessLogDestination: new apigateway.LogGroupLogDestination(logGroup),
//         accessLogFormat: apigateway.AccessLogFormat.jsonWithStandardFields({
//           httpMethod: true,
//           ip: true,
//           protocol: true,
//           requestTime: true,
//           resourcePath: true,
//           responseLength: true,
//           status: true,
//           caller: true,
//           user: true,
//         }),
//       },
//     });

//     const getByUserIdIntegration = new apigateway.LambdaIntegration(
//       props.getByUserIdFunctionHandler
//     );

//     const createUserIntegration = new apigateway.LambdaIntegration(
//       props.createUserFunctionHandler
//     );

//     // "/users"
//     const usersResource = api.root.addResource('users');

//     // GET /users/{id}
//     const userIDResource = usersResource.addResource('{id}');
//     userIDResource.addMethod('GET', getByUserIdIntegration);

//     // POST /users
//     usersResource.addMethod('POST', createUserIntegration);
//   }
// }
