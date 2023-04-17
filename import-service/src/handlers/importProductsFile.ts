import { APIGatewayProxyEvent } from 'aws-lambda';
//import { getProducts } from '../product.service';
import { headers } from '../constants';
import { errorResponse } from '../errors-hadler';
import { logRequestContextMessage } from '../logger';

export const importProductsFile = async (event: APIGatewayProxyEvent) => {
  const querystring = event.queryStringParameters;
  const fileName = querystring?.name;

  logRequestContextMessage(event.requestContext, fileName);

  try {
    if (!fileName) {
      return errorResponse(400);
    }
    const signedUrl = `uploaded/${fileName}`;

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(
        {
          data: signedUrl
        },
        null,
        2
      )
    };
  } catch (error) {
    return errorResponse(500, error.message);
  }
};
