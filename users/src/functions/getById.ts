import { Database } from 'src/shared/database';
import { APIGatewayProxyHandler } from 'aws-lambda';
import { formatJSONResponse } from '@libs/api-gateway';
import { usersService } from 'src/service/users.service';

const handler: APIGatewayProxyHandler = async (event, context, callback) => {
  context.callbackWaitsForEmptyEventLoop = false;
  const database = new Database()
  const userService = await usersService(database)

  try {
    const users = await userService.findByUserId('fb01f586-ffdd-4c26-b110-9e7bf8ebab4c')
  
    return formatJSONResponse(200, {
      message: `Encontrado usuário com sucesso!`,
      data: {
        users
      }
      
    });
  } catch (error) {
    return formatJSONResponse(500, {
      message: `Error`,
      error
      
    });
  }
  
};
export default handler
