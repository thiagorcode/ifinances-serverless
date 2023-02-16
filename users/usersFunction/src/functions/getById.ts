import { APIGatewayProxyHandler } from 'aws-lambda';
import { Database } from '@shared/database';
import { formatJSONResponse } from '@libs/api-gateway';
import { findByUserIdService } from '../service/findByUserId.service';
import '@shared/container';

const handler: APIGatewayProxyHandler = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;
  try {
    if (!event.pathParameters) {
      throw new Error('No param id');
    }
    const userId = event.pathParameters.id!;

    const database = new Database();
    console.debug('Invocado Database');

    await database.createConnection();
    console.debug('invocato createConnection');

    const findByUserId = findByUserIdService();
    console.debug('Carregou service');

    const users = await findByUserId.execute(userId);
    console.log(users);
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
