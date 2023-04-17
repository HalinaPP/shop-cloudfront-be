import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, BatchWriteCommand } from '@aws-sdk/lib-dynamodb';
import productsMockData from '../data/productsData.json';
import { REGION, productsTableName, stocksTableName } from '../constants';

const dynamoClient = new DynamoDBClient({
  region: REGION
})

const marshallOptions = {
  convertEmptyValues: false,
  removeUndefinedValues: false,
  convertClassInstanceToMap: false,
}

const unmarshallOptions = {
  wrapNumbers: false,
}

const documentClient = DynamoDBDocumentClient.from(dynamoClient, {
  marshallOptions,
  unmarshallOptions,
})

const productsRequest = productsMockData.map((product) => {

  const { count, ...productData } = product;

  return ({
    PutRequest: {
      Item: productData,
    },
  });
});

const stockRequest = productsMockData.map(({ id, count }) => ({
  PutRequest: {
    Item: {
      product_id: id,
      count,
    },
  },
}))

documentClient
  .send(new BatchWriteCommand({ RequestItems: { [productsTableName]: productsRequest, [stocksTableName]: stockRequest } }))
  .then(() => {
    console.log('initial data to products and stocks were inserted');
  })
