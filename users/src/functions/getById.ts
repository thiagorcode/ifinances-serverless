import * as dotenv from 'dotenv';
import { APIGatewayProxyHandler } from 'aws-lambda';
import { Database } from 'src/shared/database';
import { formatJSONResponse } from '@libs/api-gateway';
import { findByUserIdService } from 'src/service/findByUserId.service';
dotenv.config();

const handler: APIGatewayProxyHandler = async (event, context) => {
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
    return formatJSONResponse(500, {
      message: `Error`,
      error,
    });
  }
};

export default handler;
