import { APIGatewayProxyEvent } from 'aws-lambda';
import sweets from '../data/mock.json';

export const getProductById = async (event: APIGatewayProxyEvent) => {
  const { productId } = event.pathParameters!;

  try {
    if (!sweets) {
      throw new Error('Error: products not found');
    }

    const product = await sweets.find((product) => product.id === productId);

    if (!product) {
      throw new Error('Error: product not found');
    }

    return {
      statusCode: 200,
      body: JSON.stringify(
        {
          product
        },
        null,
        2
      )
    };
  } catch (error) {
    return {
      statusCode: 400,
      body: JSON.stringify(
        {
          error: error.message
        },
        null,
        2
      )
    };
  }
};
