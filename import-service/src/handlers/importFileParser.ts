import { APIGatewayProxyEvent } from 'aws-lambda';
import { headers } from '../constants';
import { errorResponse } from '../errors-hadler';
import { logRequestContextMessage } from '../logger';

export const importFileParser = async (event) => {
  //logRequestContextMessage(event.requestContext, fileName);

  try {

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(
        {
          data: "some"
        },
        null,
        2
      )
    };
  } catch (error) {
    return errorResponse(500, error.message);
  }
};
