import { APIGatewayProxyEvent } from 'aws-lambda';
import { addProduct } from '../services/product.service';
import { headers } from '../constants';
import { errorResponse } from '../errors-hadler';
import { logRequestContextMessage } from '../logger';
import { ProductWithCount } from '../models/product';

const isInvalidProductData = (data: ProductWithCount) => {
  const { title, description, price, count } = data;

  return (
    !title ||
    !description ||
    !price ||
    typeof price !== 'number' ||
    price <= 0 ||
    !count ||
    typeof count !== 'number' ||
    count < 1
  );
};

export const createProduct = async (event: APIGatewayProxyEvent) => {
  try {
    if (!event.body) {
      errorResponse(400);
    }

    const { body } = event;

    logRequestContextMessage(event.requestContext, body!);

    const data = JSON.parse(body!)


    if (isInvalidProductData(data)) {
      errorResponse(400);
    }

    const newProduct = await addProduct(data);

    if (!newProduct) {
      throw new Error();
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ newProduct }, null, 2)
    };
  } catch (error) {
    return errorResponse(500, error.message);
  }
};
