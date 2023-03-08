import 'reflect-metadata';
import { APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda';
import { formatJSONResponse } from '@libs/api-gateway';
import { findByUserIdService } from '../services/findByUserId.service';
import '@shared/container';

const handler: APIGatewayProxyHandler = async (event, context, callback): Promise<APIGatewayProxyResult> => {
  context.callbackWaitsForEmptyEventLoop = false;
  console.log('teste')
  try {
    if (!event.pathParameters) {
      throw new Error('No param id');
    }
    const userId = event.pathParameters.id!;

    const findByUserId = findByUserIdService();
    console.log('21', findByUserId);
    const user = await findByUserId.execute(userId);

    if (!user) {
      throw new Error('User not exist');
    }

    return formatJSONResponse(200, {
      message: `Consulta realizada com sucesso`,
      data: user,
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
