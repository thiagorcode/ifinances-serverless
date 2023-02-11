import type { APIGatewayProxyEvent, APIGatewayProxyResult, Handler } from 'aws-lambda';
import type { FromSchema } from 'json-schema-to-ts';

export const formatJSONResponse = (statusCode = 200, response: Record<string, unknown>) => {
  return {
    statusCode,
    body: JSON.stringify(response),
  };
};
