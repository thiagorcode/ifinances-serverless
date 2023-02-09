import { APIGatewayProxyHandler } from 'aws-lambda';
import { formatJSONResponse } from '@libs/api-gateway';
import * as mysql from 'serverless-mysql'

const connect = mysql({config: {
  host: 'localhost',
  database: 'finances',
  password: 'finances',
  user: 'finances'
}})

export const handler: APIGatewayProxyHandler= async (event) => {
  let results = await connect.query('SELECT * FROM gen.users')
 
  // Run clean up function
  await connect.end()
 
  return formatJSONResponse({
    message: `Hello, welcome to the exciting Serverless world!`,
    data: {
      results
    }
  });
};

