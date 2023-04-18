import { headers } from './constants';
import { logError } from './logger';

export const errorResponse = (code: number, error: string = '') => {
  const errorTitle = 'Error!';

  logError(code, error);

  return ({
    statusCode: code,
    headers,
    body: JSON.stringify(
      `${errorTitle} ${error}`,
      null,
      2
    )
  });
}