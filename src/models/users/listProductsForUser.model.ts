import { prisma } from '../../db/client.js';

export const findStoreForUser = async (storeId: number) => {
  const result = await prisma.stores.findUnique({
    where: {
      idStore: storeId,
    },
  });

  return result;
};

export const listProductsForUser = async (storeId: number) => {
  const result = await prisma.products.findMany({
    where: {
      idStore: storeId,
    },
    omit: {
      idStore: true,
    },
  });

  return result;
};
