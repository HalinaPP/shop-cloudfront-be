import { APIGatewayEventDefaultAuthorizerContext, APIGatewayEventRequestContextWithAuthorizer } from 'aws-lambda';

export const logRequestContextMessage = (requestContext: APIGatewayEventRequestContextWithAuthorizer<APIGatewayEventDefaultAuthorizerContext>
) => {
  const { requestTime, httpMethod, identity, protocol, domainName, path } =
    requestContext;

  console.log(
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
    path
  );
};
