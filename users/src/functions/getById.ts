import * as dotenv from 'dotenv';
import { APIGatewayProxyHandler } from 'aws-lambda';
import { Database } from 'src/shared/database';
import { formatJSONResponse } from '@libs/api-gateway';
import { usersService } from 'src/service/users.service';
dotenv.config();

const handler: APIGatewayProxyHandler = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;

  try {
    const userId = event.pathParameters.id;

    const database = new Database();
    const userService = await usersService(database);
    const users = await userService.findByUserId(userId);

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
