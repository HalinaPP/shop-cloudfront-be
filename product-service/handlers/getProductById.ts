import { APIGatewayProxyEvent } from 'aws-lambda';
import { getOneProduct } from '../data/data.service';
import { Product } from '../models/product';

export const getProductById = async (event: APIGatewayProxyEvent) => {
  const { productId } = event.pathParameters!;
  const headers = {
    "Access-Control-Allow-Origin": "*",
    'Access-Control-Allow-Credentials': true,
  };

  try {
    if (!productId) {
      throw new Error('Error: bad data');
    }

    const product: Product | undefined = await getOneProduct(productId);

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
