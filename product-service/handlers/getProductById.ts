import { APIGatewayProxyEvent } from 'aws-lambda';
import { getOneProduct } from '../data/data.service';

export const getProductById = async (event: APIGatewayProxyEvent) => {
  const { productId } = event.pathParameters!;
  const reqC = event.requestContext;

  console.log(
    reqC.requestTime +
    ' ' +
    reqC.httpMethod +
    ' ' +
    reqC.identity.sourceIp +
    ' ' +
    reqC.identity.userAgent +
    ' ' +
    reqC.protocol +
    ' ' +
    reqC.domainName +
    ' ' +
    reqC.path
  );

  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Credentials': true
  };

  try {
    if (!productId) {
      throw new Error('Error: bad data');
    }

    const product = await getOneProduct(productId);

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
