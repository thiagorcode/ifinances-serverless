import { APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda';
import { Database } from '@shared/database';
import { formatJSONResponse } from '@libs/api-gateway';
import { findByUserIdService } from '../services/findByUserId.service';
import '@shared/container';

const handler: APIGatewayProxyHandler = async (event, context): Promise<APIGatewayProxyResult> => {
  context.callbackWaitsForEmptyEventLoop = false;
  try {
    if (!event.pathParameters) {
      throw new Error('No param id');
    }
    const userId = event.pathParameters.id!;

    const database = new Database();

    await database.createConnection();

    const findByUserId = findByUserIdService();

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
