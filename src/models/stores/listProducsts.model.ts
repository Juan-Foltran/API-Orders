import { prisma } from '../../db/client.js';

export const listProducts = async (storeId: number) => {
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
