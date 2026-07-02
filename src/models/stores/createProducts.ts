import { prisma } from '../../db/client.js';
import { type createProduct } from './stores.types.js';

export const createProducts = async (product: createProduct, idStore: number) => {
  try {
    const creationProduct = await prisma.products.create({
      data: {
        name: product.title,
        description: product.description,
        price: product.price,
        idStore: idStore,
      },
    });

    return creationProduct.name;
  } catch (err) {
    throw new Error('Erro ao criar o produto');
  }
};
