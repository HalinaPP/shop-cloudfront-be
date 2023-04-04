import sweets from '../data/mock.json';
import { Product } from '../models/product';

export const getProducts = async (): Promise<Product[]> => Promise.resolve(sweets);


export const getOneProduct = async (id: string): Promise<Product | undefined> => {
  if (!sweets) {
    throw new Error('Error: products not found');
  }

  const product = sweets.find((product) => product.id === id);

  return Promise.resolve(product);
}