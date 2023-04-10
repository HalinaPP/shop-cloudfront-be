import { getProductById } from './handlers/getProductById';
import { getProductsList } from './handlers/getProductsList';
import { DynamoDB } from 'aws-sdk';

export const db = new DynamoDB.DocumentClient();

export { getProductsList, getProductById };