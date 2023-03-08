import 'reflect-metadata';
import { APIGatewayProxyHandler } from 'aws-lambda';
import * as getByUserIdFunction from './src/functions/getById';
// import * as createFunction from './src/functions/create'

// import * as updateFunction from './src/functions/update'
// import * as removeFunction from './src/functions/remove'

// export const create: APIGatewayProxyHandler = async (event, context) => {
//   return createFunction.default(event, context);
// };

export const getByUserId: APIGatewayProxyHandler = async (event, context, callback) => {
  return await getByUserIdFunction.default(event, context, callback);
};

// export const update: APIGatewayProxyHandler = async (event, context) => {
//   return updateFunction.default(event, context);
// };

// export const remove: APIGatewayProxyHandler = async (event, context) => {
//   return removeFunction.default(event, context);
// };
