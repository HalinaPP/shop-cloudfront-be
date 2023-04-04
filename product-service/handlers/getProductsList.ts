import sweets from '../data/mock.json';

export const getProductsList = async (event) => {
  try {
    if (!sweets) {
      throw new Error('Error: products not found');
    }

    return {
      statusCode: 200,
      body: JSON.stringify(
        {
          products: sweets
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
