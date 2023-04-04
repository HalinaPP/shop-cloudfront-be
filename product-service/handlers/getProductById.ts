import { APIGatewayProxyEvent } from 'aws-lambda';
import { getProducts } from '../data/data.service';

export const getProductById = async (event: APIGatewayProxyEvent) => {
  const { productId } = event.pathParameters!;
  const headers = {
    "Access-Control-Allow-Origin": "*",
    'Access-Control-Allow-Credentials': true,
  };

  try {
    const sweets = await getProducts();

    if (!sweets) {
      throw new Error('Error: products not found');
    }

    const product = sweets.find((product) => product.id === productId);

    if (!product) {
      throw new Error('Error: product not found');
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
    return {
      statusCode: 400,
      headers,
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
