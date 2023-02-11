import * as dotenv from 'dotenv';
import { APIGatewayProxyHandler } from 'aws-lambda';
import { Database } from '@shared/database';
import { formatJSONResponse } from '@libs/api-gateway';
import { findByUserIdService } from '../service/findByUserId.service';
import '@shared/container';
dotenv.config();

const handler: APIGatewayProxyHandler = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;
  try {
    console.log('1');
    if (!event.pathParameters) {
      throw new Error('No param id');
    }
    console.log('test 2');
    const userId = event.pathParameters.id!;
    console.log('test 3');

    const database = new Database();
    console.log('test 4');

    await database.createConnection();
    console.log('test 4');

    const findByUserId = findByUserIdService();
    console.log('test 5');

    const users = await findByUserId.execute(userId);

    return formatJSONResponse(200, {
      message: `Consulta realizada com sucesso`,
      data: users,
    });
  } catch (error) {
    console.log(error);
    return formatJSONResponse(500, {
      message: `Error`,
      error: String(error),
    });
  }
};

export default handler;
