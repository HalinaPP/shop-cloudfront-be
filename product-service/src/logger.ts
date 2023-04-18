import {
  APIGatewayEventDefaultAuthorizerContext,
  APIGatewayEventRequestContextWithAuthorizer
} from 'aws-lambda';

export const logRequestContextMessage = (
  requestContext: APIGatewayEventRequestContextWithAuthorizer<APIGatewayEventDefaultAuthorizerContext>,
  body = ''
) => {
  const { requestTime, httpMethod, identity, protocol, domainName, path } =
    requestContext;

  let message =
    requestTime +
    ' ' +
    httpMethod +
    ' ' +
    identity.sourceIp +
    ' ' +
    identity.userAgent +
    ' ' +
    protocol +
    ' ' +
    domainName +
    ' ' +
    path;

  if (body) {
    message += ' ' + body;
  }
  console.log(message);
};

export const logError = (code: number, message: string) => {
  console.log(`error code: ${code}, message: ${message}`);
}