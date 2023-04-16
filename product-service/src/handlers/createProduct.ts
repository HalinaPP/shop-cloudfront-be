import { APIGatewayProxyEvent } from 'aws-lambda';
import { addProduct } from '../product.service';
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
    logRequestContextMessage(event.requestContext);

    const data = event.body
      ? JSON.parse(event.body)
      : {
        description: 'This is new sweets',
        price: 88,
        title: 'New sweets',
        count: 11
      };

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
