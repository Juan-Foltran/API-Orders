import { prisma } from '../../db/client.js';
import { type createProduct } from './stores.types.js';

export const getStores = async (id: number) => {
  const result = await prisma.users.findUnique({
    where: {
      id,
    },
    select: {
      stores: {
        select: {
          idStore: true,
        },
      },
    },
  });

  return result?.stores ?? [];
};

export const createProducts = async (product: createProduct) => {
  try {
    const creationProduct = await prisma.products.create({
      data: {
        name: product.title,
        description: product.description,
        price: product.price,
        idStore: product.idStore,
      },
    });

    return creationProduct;
  } catch (err) {
    throw new Error('Erro ao criar o produto');
  }
};
