import { headers } from './constants';

export const errorResponse = (code: number, error?: string,) => ({
  statusCode: code,
  headers,
  body: JSON.stringify(
    `Error!. ${error}`,
    null,
    2
  )
});