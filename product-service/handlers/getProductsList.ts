import { APIGatewayProxyEvent } from 'aws-lambda';
import { getProducts } from '../data/data.service';
import { Product } from '../models/product';

export const getProductsList = async (event: APIGatewayProxyEvent) => {
  const headers = {
    "Access-Control-Allow-Origin": "*",
    'Access-Control-Allow-Credentials': true
  };

  try {
    const sweets: Product[] = await getProducts();

    if (!sweets) {
      throw new Error('Error: products not found');
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify([...sweets], null, 2)
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
