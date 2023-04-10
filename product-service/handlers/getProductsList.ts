import { APIGatewayProxyEvent } from 'aws-lambda';
import { getProducts } from '../data/data.service';


export const getProductsList = async (event: APIGatewayProxyEvent) => {
  const reqC = event.requestContext;
  console.log(reqC.requestTime + ' ' + reqC.httpMethod + ' ' + reqC.identity.sourceIp + ' ' + reqC.identity.userAgent +
    ' ' + reqC.protocol + ' ' + reqC.domainName + ' ' + reqC.path);


  const headers = {
    "Access-Control-Allow-Origin": "*",
    'Access-Control-Allow-Credentials': true
  };

  try {
    const products = await getProducts();

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(products, null, 2)
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
