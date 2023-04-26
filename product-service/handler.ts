import { DynamoDB } from 'aws-sdk';
import { getProductsList, getProductById, createProduct, catalogBatchProcess } from './src/handlers';

export const db = new DynamoDB.DocumentClient();

export { getProductsList, getProductById, createProduct, catalogBatchProcess };