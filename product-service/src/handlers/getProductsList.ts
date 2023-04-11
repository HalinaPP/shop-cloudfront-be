import { APIGatewayProxyEvent } from 'aws-lambda';
import { getProducts } from '../product.service';
import { headers } from '../constants';
import { errorResponse } from '../errors-hadler';
import { logRequestContextMessage } from '../logger';

export const getProductsList = async (event: APIGatewayProxyEvent) => {
  logRequestContextMessage(event.requestContext)

  try {
    const products = await getProducts();

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(products, null, 2)
    };
  } catch (error) {
    return errorResponse(500, error.message);
  }
};
