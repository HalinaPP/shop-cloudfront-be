import { addProduct } from '../services/product.service';
import { headers } from '../constants';
import { errorResponse } from '../errors-hadler';

export const catalogBatchProcess = async (event) => {
  try {
    console.log('event:', event);

    const newProduct = {};
    //const newProduct = await addProduct(data);

    //if (!newProduct) {
    // throw new Error();
    // }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ newProduct }, null, 2)
    };
  } catch (error) {
    return errorResponse(500, error.message);
  }
};
