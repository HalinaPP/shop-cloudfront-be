import { APIGatewayProxyEvent } from 'aws-lambda';
import { getOneProduct } from '../services/product.service';
import { headers } from '../constants';
import { errorResponse } from '../errors-hadler';
import { logRequestContextMessage } from '../logger';

export const getProductById = async (event: APIGatewayProxyEvent) => {
  const { productId } = event.pathParameters!;

  logRequestContextMessage(event.requestContext)

  try {
    if (!productId) {
      return errorResponse(400);
    }

    const product = await getOneProduct(productId);

    if (!product) {
      return errorResponse(404);
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(
        {
          product
        },
        null,
        2
      )
    };
  } catch (error) {
    return errorResponse(500, error.message);
  }
};
