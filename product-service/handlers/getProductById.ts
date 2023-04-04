import sweets from '../data/mock.json';

export const getProductById = async (event) => {
  const { id } = event.queryParams;
  //const productId = event.path.split('/')[2];
  try {
    if (!sweets) {
      throw new Error('Error: products not found');
    }

    const product = await sweets.find((product) => product.id === id);

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
