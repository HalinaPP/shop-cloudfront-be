import { v4 as uuidv4 } from 'uuid';
import { errorResponse } from '../errors-hadler';
import { db } from '../../handler';
import { Product, ProductWithCount } from '../models/product';
import { productsTableName, stocksTableName } from '../constants';
import { Stock } from '../models/stock';

const isEmptyResult = (queryResult) => {
  return !queryResult || !queryResult.Items || !queryResult.Items[0];
};

const getItem = async (
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
    errorResponse(404, 'Product not found');
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
    errorResponse(404, 'Products not found');
  }

  const productsWithStockData = await Promise.allSettled(
    products!.Items!.map(async (item) => {
      const stocks = await getItem(stocksTableName, 'product_id', item.id);

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

export const getOneProduct = async (id: string): Promise<ProductWithCount> => {
  const product = (await getItem(productsTableName, 'id', id)) as Product;
  const stock = await getItem(stocksTableName, 'product_id', id) as Stock;

  const productById = {
    ...product,
    count: stock.count
  };

  return productById;
};

const addItem = async (
  tableName: string,
  data: object,
) => {
  const params = {
    TableName: tableName,
    Item: {
      ...data
    }
  };

  await db.put(params).promise();
};

export const addProduct = async (data: ProductWithCount): Promise<ProductWithCount> => {
  const id = uuidv4();

  const { count, ...productData } = data;
  productData.id = id;
  await addItem(productsTableName, productData);

  const stockData = { product_id: id, count }
  await addItem(stocksTableName, stockData)

  /*await db.transactWrite({
    TransactItems: [
      {
        Put: {
          TableName: productsTableName,
          Item: { ...productData },
        },
      },
      {
        Put: {
          TableName: stocksTableName,
          Item: { ...stockData },
        },
      }
    ]
  });*/

  const product = await getOneProduct(id);
  return product;
} 