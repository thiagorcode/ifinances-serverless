export const formatJSONResponse = (statusCode = 200, response: Record<string, unknown>) => {
  return {
    statusCode,
    body: JSON.stringify(response),
  };
};
