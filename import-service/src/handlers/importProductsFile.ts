import { S3 } from 'aws-sdk';
import { APIGatewayProxyEvent } from 'aws-lambda';
import { REGION, headers, BUCKET } from '../constants';
import { errorResponse } from '../errors-hadler';
import { logRequestContextMessage } from '../logger';

const createPresignedUrlWithClient = async ({ region, bucket, key }) => {
  const s3 = new S3({ region, signatureVersion: 'v4' });
  const signedUrl = await s3.getSignedUrlPromise('putObject', {
    Bucket: bucket,
    Key: key
  });

  return signedUrl;
};

export const importProductsFile = async (event: APIGatewayProxyEvent) => {
  const querystring = event.queryStringParameters;
  const fileName = querystring?.name;
  const bucketFolder = 'uploaded';

  logRequestContextMessage(event.requestContext, fileName);

  try {
    if (!fileName) {
      return errorResponse(400);
    }

    const clientUrl = await createPresignedUrlWithClient({
      region: REGION,
      bucket: BUCKET,
      key: `${bucketFolder}/${fileName}`
    });

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(clientUrl, null, 2)
    };
  } catch (error) {
    return errorResponse(500, error.message);
  }
};
