import { APIGatewayProxyEvent } from 'aws-lambda';
import { headers } from '../constants';
import { errorResponse } from '../errors-hadler';
import { logRequestContextMessage } from '../logger';

export const importFileParser = async (event) => {
  // const { productId } = event.pathParameters!;

  console.log('evet=', event);
  //logRequestContextMessage(event.requestContext)

  try {
    /*   if (!productId) {
         return errorResponse(400);
       }
   
       const product = await getOneProduct(productId);
   
       if (!product) {
         return errorResponse(404);
       }
   */
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(
        {
          o: "some"
        },
        null,
        2
      )
    };
  } catch (error) {
    return errorResponse(500, error.message);
  }
};
