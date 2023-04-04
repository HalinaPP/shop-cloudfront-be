import { getProducts } from '../data/data.service';

export const getProductsList = async (event) => {
  const headers = {
    "Access-Control-Allow-Origin": "*",
    'Access-Control-Allow-Credentials': true
  };

  try {
    const sweets = await getProducts();

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
