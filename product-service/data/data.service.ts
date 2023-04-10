import { DynamoDB } from 'aws-sdk';
import { db } from '../handler';
import { Product } from '../models/product';

const productsTableName = process.env.TABLE_PRODUCTS || 'products';
const stocksTableName = process.env.TABLE_STOCKS || 'stocks';

const isEmptyResult = (queryResult) => {
  return !queryResult || !queryResult.Items || !queryResult.Items[0];
};

const getItem = async (
  db: DynamoDB.DocumentClient,
  tableName: string,
  keyName: string,
  keyValue: string
) => {
  const params = {
    TableName: tableName,
    KeyConditionExpression: `${keyName} = :${keyName}`,
    ExpressionAttributeValues: {
      [`:${keyName}`]: keyValue
    },
    Limit: 1
  };

  const queryResult = await db.query(params).promise();

  if (isEmptyResult(queryResult)) {
    throw new Error('Error: product not found');
  }

  return queryResult!.Items![0];
};

export const getProducts = async () => {
  const products = await db
    .scan({
      TableName: productsTableName
    })
    .promise();

  if (!products) {
    throw new Error('Error: products not found');
  }

  const productsWithStockData = await Promise.allSettled(
    products!.Items!.map(async (item) => {
      const stocks = await getItem(db, stocksTableName, 'product_id', item.id);

      return {
        ...item,
        count: stocks.count
      };
    })
  );

  const fulfilledProducts = productsWithStockData
    .map((entry) => (entry.status === 'fulfilled' ? entry.value : null))
    .filter((entry) => entry !== null);

  return fulfilledProducts;
};

export const getOneProduct = async (id: string) => {
  if (!id) {
    throw new Error('Error: bad data');
  }

  const products = await getItem(db, productsTableName, 'id', id);
  const stocks = await getItem(db, stocksTableName, 'product_id', id);

  const productById = {
    ...products,
    count: stocks.count
  };

  return productById;
};
